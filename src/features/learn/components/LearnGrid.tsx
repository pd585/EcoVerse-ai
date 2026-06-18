'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Check, Play, Sparkles, X, Clock, Zap, AlertTriangle, CheckCircle, Award 
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/layout/AuthProvider';
import { lessons, Lesson } from '@/data/learn-data';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';

// Helper to recalculate achievements based on completions and XP
function recalculateAchievements(completedCount: number, totalXp: number): string[] {
  const unlocked: string[] = [];
  if (completedCount >= 1) unlocked.push('first_lesson_completed');
  if (completedCount >= 5) unlocked.push('five_lessons_completed');
  if (completedCount >= 10) unlocked.push('ten_lessons_completed');
  if (completedCount >= 25) unlocked.push('twentyfive_lessons_completed');

  if (totalXp >= 100) unlocked.push('xp_100_earned');
  if (totalXp >= 250) unlocked.push('xp_250_earned');
  if (totalXp >= 500) unlocked.push('xp_500_earned');
  return unlocked;
}

export function LearnGrid() {
  const { user } = useAuth();
  
  // Local storage state
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState<number>(0);
  
  // Active expanded module ID
  const [expandedModule, setExpandedModule] = useState<string | null>('carbon-footprints');
  
  // Active lesson dialog/modal
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  
  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCompleted = safeGetStorageItem<string[]>('ecoverse_completed_lessons', []);
      setCompletedIds(storedCompleted);
      const storedXp = safeGetStorageItem('ecoverse_total_xp', 0);
      setTotalXp(storedXp);
    }
  }, []);

  // Compute Module metrics
  const modules = [
    { id: 'carbon-footprints', title: 'Carbon Footprints', emoji: '👣', blurb: 'What a footprint really is, and where yours hides.', accent: 'emerald' },
    { id: 'climate-change', title: 'Climate Change', emoji: '🌡️', blurb: 'The science of a warming world, made clear.', accent: 'ocean' },
    { id: 'renewable-energy', title: 'Renewable Energy', emoji: '⚡', blurb: 'Solar, wind, and the grid of the future.', accent: 'aurora' },
    { id: 'sustainable-living', title: 'Sustainable Living', emoji: '🌿', blurb: 'Everyday habits that quietly add up.', accent: 'emerald' },
    { id: 'green-technology', title: 'Green Technology', emoji: '🔬', blurb: 'The innovations rewriting our impact.', accent: 'ocean' },
  ];

  // Resolve recommendation logic ("Continue Learning")
  // Find first incomplete lesson in chronological order
  const recommendedLesson = lessons.find(l => !completedIds.includes(l.id)) || null;

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsQuizMode(false);
    setSelectedAnswer(null);
    setQuizFeedback(null);
  };

  const handleAnswerSelect = (index: number) => {
    if (quizFeedback?.type === 'success') return; // Locked once correct
    setSelectedAnswer(index);
    setQuizFeedback(null);
  };

  const handleQuizSubmit = () => {
    if (!selectedLesson || selectedAnswer === null) return;

    if (selectedAnswer === selectedLesson.quiz.correctAnswerIndex) {
      setQuizFeedback({
        type: 'success',
        msg: `Correct! You have successfully mastered this lesson and earned +${selectedLesson.xp} XP.`
      });

      // Update state and local storage
      const nextCompleted = [...completedIds];
      if (!nextCompleted.includes(selectedLesson.id)) {
        nextCompleted.push(selectedLesson.id);
        setCompletedIds(nextCompleted);
        safeSetStorageItem('ecoverse_completed_lessons', nextCompleted);

        const nextXp = totalXp + selectedLesson.xp;
        setTotalXp(nextXp);
        safeSetStorageItem('ecoverse_total_xp', nextXp);

        // Recalculate achievements
        const unlocked = recalculateAchievements(nextCompleted.length, nextXp);
        safeSetStorageItem('ecoverse_unlocked_achievements', unlocked);

        // Mark dashboard cache dirty
        safeSetStorageItem('ecoverse_dashboard_cache_dirty', true);
        safeSetStorageItem('ecoverse_cache_dirty', true);
      }
    } else {
      setQuizFeedback({
        type: 'error',
        msg: 'Incorrect answer. Read the key takeaways above and try again!'
      });
    }
  };

  return (
    <AppShell
      title="Learn Hub"
      subtitle="Bite-sized, beautiful learning. Build mastery one module at a time."
    >
      {/* ── CONTINUE LEARNING FEATURED CARD ─────────────────────────────── */}
      <div className="glass-premium relative mb-8 overflow-hidden rounded-3xl p-7 border border-accent-cyan/15 bg-navy-deep/55">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-emerald/10 blur-3xl pointer-events-none" />
        
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-[#00F5A0] mb-4">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Continue Learning
        </span>

        {recommendedLesson ? (
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">{recommendedLesson.title}</h2>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 sm:text-sm max-w-xl">
              {recommendedLesson.explanation}
            </p>
            
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-semibold text-accent-cyan px-2.5 py-1 rounded-full bg-accent-cyan/10 uppercase tracking-wider">
                {recommendedLesson.moduleName}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground font-medium">
                <Clock className="h-3.5 w-3.5 text-accent-cyan" /> {recommendedLesson.duration}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground font-medium">
                <Zap className="h-3.5 w-3.5 text-aurora" /> +{recommendedLesson.xp} XP ({recommendedLesson.difficulty})
              </span>
            </div>

            <div className="mt-5">
              <button
                onClick={() => handleOpenLesson(recommendedLesson)}
                className="flex items-center gap-2 rounded-full bg-aurora px-6 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[var(--glow-emerald)]"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Start Recommended Lesson
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">🎉 Journey Complete!</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Congratulations, you have completed all 32 sustainability lessons in the EcoVerse Learn Hub. You are officially an Eco Grandmaster!
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-aurora">
              <Award className="h-4 w-4" /> 500+ XP Mastered
            </div>
          </div>
        )}
      </div>

      {/* ── CONNECTED PATHWAY SYSTEM ─────────────────────────────────────── */}
      <h2 className="text-lg font-700 mb-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary" /> Learning Journey Modules
      </h2>

      <div className="space-y-4">
        {modules.map((t, i) => {
          const moduleLessonsList = lessons.filter(l => l.moduleId === t.id);
          const completedModuleLessons = moduleLessonsList.filter(l => completedIds.includes(l.id));
          const progress = moduleLessonsList.length > 0 
            ? Math.round((completedModuleLessons.length / moduleLessonsList.length) * 100) 
            : 0;

          const isCompleted = progress === 100;
          const isInProgress = progress > 0 && progress < 100;
          const isNotStarted = progress === 0;
          const isExpanded = expandedModule === t.id;

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden border border-white/5 bg-navy-mid/30"
            >
              {/* Module Header Card */}
              <button
                onClick={() => setExpandedModule(isExpanded ? null : t.id)}
                className="w-full p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      'grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl border transition-colors',
                      isCompleted ? 'border-[#00F5A0]/20 bg-[#00F5A0]/5' : 'border-white/5 bg-navy-deep/40',
                    )}
                  >
                    {t.emoji}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                      {t.blurb}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col md:items-end gap-1.5 min-w-[120px]">
                  <div className="text-[10px] text-muted-foreground">
                    {completedModuleLessons.length} / {moduleLessonsList.length} lessons
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs font-bold">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[#00F5A0]">
                        <Check className="h-3.5 w-3.5" aria-hidden /> Complete
                      </span>
                    ) : (
                      <span className={isInProgress ? 'text-[#00E5FF]' : 'text-muted-foreground'}>
                        {progress}%
                      </span>
                    )}
                  </div>
                  
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-950/40">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isCompleted ? 'bg-[#00F5A0]' : 'bg-[#00E5FF]',
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Module Lessons Sub-grid */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-navy-deep/15 border-t border-white/5"
                  >
                    <div className="p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {moduleLessonsList.map((lesson) => {
                        const lessonCompleted = completedIds.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className={cn(
                              "glass-premium flex flex-col justify-between rounded-xl overflow-hidden border transition-all relative",
                              lessonCompleted 
                                ? "border-accent-emerald/20 bg-accent-emerald/5 hover:bg-accent-emerald/10"
                                : "border-white/5 bg-navy-deep/20 hover:border-white/10 hover:bg-navy-deep/35"
                            )}
                          >
                            {/* Card Image Header with Dark Overlay */}
                            <div className="relative h-24 w-full overflow-hidden">
                              <img 
                                src={lesson.coverImage} 
                                alt={lesson.title} 
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-950/40" />
                              <span className={cn(
                                "absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                lesson.difficulty === 'Easy' && "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30",
                                lesson.difficulty === 'Medium' && "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                                lesson.difficulty === 'Advanced' && "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              )}>
                                {lesson.difficulty}
                              </span>
                              <span className="absolute top-2 right-2 text-[9px] text-white/95 font-semibold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                                <Clock className="h-2.5 w-2.5" /> {lesson.duration}
                              </span>
                            </div>

                            <div className="p-4 flex flex-col justify-between flex-1">
                              <div>
                                <h4 className="text-sm font-bold text-foreground line-clamp-1 mb-1">
                                  {lesson.title}
                                </h4>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">
                                  {lesson.explanation}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                                <span className="text-[11px] font-bold text-aurora flex items-center gap-0.5">
                                  <Zap className="h-3 w-3" /> +{lesson.xp} XP
                                </span>
                                
                                {lessonCompleted ? (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-accent-emerald bg-accent-emerald/10 px-2 py-1 rounded-full">
                                    <CheckCircle className="h-3 w-3" /> Done
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleOpenLesson(lesson)}
                                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-accent-cyan transition-colors"
                                  >
                                    <Play className="h-3 w-3 fill-current" /> Learn
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── LESSON & QUIZ MODAL OVERLAY ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLesson(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-navy-mid border border-white/10 p-6 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedLesson(null)}
                className="absolute right-4 top-4 text-white hover:text-foreground transition-colors z-20"
              >
                <X className="h-5 w-5" />
              </button>

              {!isQuizMode ? (
                /* Lesson Study State */
                <div>
                  {/* Banner Image Header with 60% Dark Overlay */}
                  <div className="relative h-40 w-full overflow-hidden -mx-6 -mt-6 mb-6">
                    <img 
                      src={selectedLesson.coverImage} 
                      alt={selectedLesson.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60" />
                    <span className="absolute bottom-4 left-6 text-[10px] font-bold text-accent-cyan px-2.5 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 uppercase tracking-wider">
                      {selectedLesson.moduleName}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">{selectedLesson.title}</h3>
                  
                  <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {selectedLesson.explanation}
                  </div>

                  <div className="mt-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent-cyan">Key Takeaways</h4>
                    <ul className="space-y-2">
                      {selectedLesson.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00F5A0]" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-xs text-aurora font-bold flex items-center gap-0.5">
                      <Zap className="h-4 w-4" /> +{selectedLesson.xp} XP reward
                    </span>

                    <button
                      onClick={() => setIsQuizMode(true)}
                      className="rounded-full bg-aurora px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-[var(--glow-emerald)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Take Quiz to Complete
                    </button>
                  </div>
                </div>
              ) : (
                /* Quiz State */
                <div>
                  <h3 className="text-base font-bold text-accent-cyan mb-2">Concept Check quiz</h3>
                  <h4 className="text-base font-bold text-foreground mb-4">
                    {selectedLesson.quiz.question}
                  </h4>

                  <div className="space-y-3">
                    {selectedLesson.quiz.options.map((option, idx) => {
                      const isChosen = selectedAnswer === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(idx)}
                          className={cn(
                            "w-full text-left p-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between",
                            isChosen 
                              ? "bg-accent-cyan/10 border-accent-cyan text-foreground"
                              : "bg-navy-deep/30 border-white/5 text-muted-foreground hover:bg-white/5"
                          )}
                        >
                          <span>{option}</span>
                          {isChosen && <span className="h-2 w-2 rounded-full bg-accent-cyan" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Message */}
                  <AnimatePresence>
                    {quizFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "mt-4 p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold border",
                          quizFeedback.type === 'success'
                            ? "bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald"
                            : "bg-rose-950/20 border-rose-900/30 text-rose-300"
                        )}
                      >
                        {quizFeedback.type === 'success' ? (
                          <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        )}
                        <span>{quizFeedback.msg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
                    {quizFeedback?.type === 'success' ? (
                      <>
                        <span className="text-xs text-accent-emerald font-bold">🎉 Mastery Unlocked!</span>
                        <button
                          onClick={() => setSelectedLesson(null)}
                          className="rounded-full bg-white/10 border border-white/10 px-6 py-2.5 text-xs font-bold text-foreground hover:bg-white/15"
                        >
                          Close Lesson
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsQuizMode(false)}
                          className="text-xs font-bold text-muted-foreground hover:text-foreground"
                        >
                          Back to Study
                        </button>
                        <button
                          onClick={handleQuizSubmit}
                          disabled={selectedAnswer === null}
                          className="rounded-full bg-aurora px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-[var(--glow-emerald)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Answer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
