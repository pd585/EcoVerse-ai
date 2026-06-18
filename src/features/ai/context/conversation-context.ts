import { supabase } from '@/lib/supabase';
import { AIMessage } from '../types';
import { aiService } from '../services/ai.service';

export class ConversationContextService {
  /**
   * Loads recent chat messages from the ai_conversations table for context.
   * Limits results and compresses long history using summary steps.
   */
  async loadRecentMessages(
    userId: string,
    limitCount: number = 20
  ): Promise<AIMessage[]> {
    if (!userId) {
      throw new Error('User ID is required to load conversation memory.');
    }

    const { data: messages, error } = await (supabase.from('ai_conversations') as any)
      .select('role, message, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !messages || messages.length === 0) {
      return [];
    }

    // Restore chronological order (oldest first)
    const allMsgs = messages
      .reverse()
      .map((msg: any) => ({
        role: (msg.role === 'coach' ? 'assistant' : msg.role) as 'user' | 'assistant' | 'system',
        content: msg.message,
      }));

    // If history is small, return directly
    if (allMsgs.length <= limitCount) {
      return allMsgs;
    }

    // Keep the latest 10 messages raw
    const latestMsgs = allMsgs.slice(allMsgs.length - 10);
    const olderMsgs = allMsgs.slice(0, allMsgs.length - 10);

    // Summarize older messages
    const summary = await this.generateSummary(olderMsgs);

    // Return the summary as a system context prepended to the latest messages
    return [
      {
        role: 'system' as const,
        content: `Summary of previous discussion: ${summary}`
      },
      ...latestMsgs
    ];
  }

  /**
   * Formats conversation messages into a clean markdown history string.
   */
  formatHistory(messages: AIMessage[]): string {
    if (messages.length === 0) {
      return 'No previous message history found.';
    }

    return messages
      .map(m => {
        const sender = m.role === 'user' ? 'User' : m.role === 'system' ? 'System' : 'AI Coach';
        return `**${sender}**: ${m.content}`;
      })
      .join('\n\n');
  }

  /**
   * Summarizes older messages to compress history and reduce tokens.
   */
  async generateSummary(messages: AIMessage[]): Promise<string> {
    if (messages.length === 0) {
      return '';
    }

    try {
      console.log(`[ConversationContext] Condensing ${messages.length} messages...`);
      const summaryPrompt = [
        {
          role: 'system' as const,
          content: 'You are the EcoVerse History Condenser. Condense the following chat messages between a user and the EcoVerse Coach into a brief, 2-3 sentence summary of the discussed sustainability topics, goals, and choices. Keep it extremely concise.'
        },
        {
          role: 'user' as const,
          content: messages.map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n')
        }
      ];
      
      const result = await aiService.generateResponse(summaryPrompt);
      return result.content;
    } catch (err) {
      console.warn('[ConversationContext] Failed to generate history summary, using fallback:', err);
      return 'Previous discussion touched on baseline carbon footprint reductions and eco habits.';
    }
  }
}

export const conversationContextService = new ConversationContextService();
