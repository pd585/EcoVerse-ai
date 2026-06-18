import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/features/ai/services/ai.service';
import { prompts } from '@/features/ai/prompts';
import { AIMessage } from '@/features/ai/types';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { sanitizeUserMessage } from '@/lib/security';

const chatRequestSchema = z.object({
  feature: z.enum(['coach', 'dashboard', 'roadmap', 'learn', 'assessment', 'simulator']),
  message: z.string().min(1).max(5000),
  invalidateCache: z.boolean().optional(),
  clientContext: z.record(z.string(), z.any()).optional(),
  context: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request payload.',
          details: validation.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { feature, message, invalidateCache, clientContext, context: clientPassedContext } = validation.data;

    // Sanitize user input against prompt injection and XSS
    const sanitizedMessage = sanitizeUserMessage(message);

    // Get the correct system instruction prompt matching the feature domain
    const promptConfig = prompts[feature];
    if (!promptConfig) {
      return NextResponse.json(
        { error: `Feature domain "${feature}" is not recognized or supported.` },
        { status: 400 }
      );
    }

    // Authorization verification
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    let userId: string | undefined = undefined;

    if (token) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // Build the AI message payload with the system prompt first
    const messagesPayload: AIMessage[] = [
      { role: 'system', content: promptConfig.systemInstruction }
    ];

    let conversationHistory: AIMessage[] = [];

    if (userId) {
      // 1. Fetch Unified Eco Intelligence Profile
      const { ecoIntelligenceService } = await import('@/features/ai/services/eco-intelligence.service');
      if (invalidateCache) {
        ecoIntelligenceService.invalidateCache(userId);
      }
      const ecoProfile = await ecoIntelligenceService.generateProfile(userId);

      // 2. Load Profile & Carbon & Roadmap & Simulator contexts
      const { profileContextService } = await import('@/features/ai/context/profile-context');
      const serverContext = await profileContextService.loadUserProfileContext(userId);

      // 3. Load Memory logs (returns summarized long history + latest messages)
      const { conversationContextService } = await import('@/features/ai/context/conversation-context');
      conversationHistory = await conversationContextService.loadRecentMessages(userId, 20);

      // 4. Formulate structured text context segment using context-builder mapping
      const { contextBuilder } = await import('@/features/ai/context/context-builder');
      const formattedContext = contextBuilder.buildPromptContext(
        sanitizedMessage,
        conversationHistory,
        serverContext,
        ecoProfile,
        clientContext
      );
      messagesPayload.push({ role: 'user', content: formattedContext });
    } else {
      // Fallback to client-passed context if server session is not resolved
      if (clientPassedContext && typeof clientPassedContext === 'object') {
        const { contextBuilder } = await import('@/features/ai/context/context-builder');
        const formattedContext = contextBuilder.buildPromptContext(
          sanitizedMessage,
          [],
          clientPassedContext
        );
        messagesPayload.push({ role: 'user', content: formattedContext });
      } else {
        messagesPayload.push({ role: 'user', content: sanitizedMessage });
      }
    }

    // Invoke provider orchestration layer (handles automatic fallback chain)
    const aiResponse = await aiService.generateResponse(messagesPayload);

    // If it's a JSON-returning feature, parse and sanitize using safeParseAIResponse
    if (feature !== 'coach') {
      const parsedContent = aiService.safeParseAIResponse(aiResponse.content, feature);
      aiResponse.content = JSON.stringify(parsedContent);
    }

    return NextResponse.json(aiResponse);
  } catch (err: any) {
    console.error('Error in AI Secure Endpoint handler:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during content generation.' },
      { status: 500 }
    );
  }
}
