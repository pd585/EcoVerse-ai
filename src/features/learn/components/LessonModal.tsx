'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Lesson } from '@/data/learn-data';
import { cn } from '@/lib/utils';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (xpEarned: number, lessonId: string) => void;
}

export default function LessonModal({
  lesson,
  onClose,
  onComplete,
}: LessonModalProps) {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{
    type: 'success' | 'error';
    msg: string;
  } | null>(null);

  const handleAnswerSelect = (index: number) => {
    if (quizFeedback?.type === 'success') return; // Locked once correct
    setSelectedAnswer(index);
    setQuizFeedback(null);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === lesson.quiz.correctAnswerIndex) {
      setQuizFeedback({
        type: 'success',
        msg: `Correct! You have successfully mastered this lesson and earned +${lesson.xp} XP.`,
      });
      onComplete(lesson.xp, lesson.id);
    } else {
      setQuizFeedback({
        type: 'error',
        msg: 'Incorrect choice. Review the takeaways and try again!',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/80 backdrop-blur-md p-4 lg:p-6">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-navy-mid border border-white/10 p-6 shadow-2xl z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white hover:text-foreground transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {!isQuizMode ? (
          /* Lesson Study State */
          <div>
            {/* Banner Image Header with 60% Dark Overlay */}
            <div className="relative h-40 w-full overflow-hidden -mx-6 -mt-6 mb-6">
              <Image
                src={lesson.coverImage}
                alt={lesson.title}
                fill
                sizes="(max-width: 512px) 100vw, 512px"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/60 z-10" />
              <span className="absolute bottom-4 left-6 text-[10px] font-bold text-accent-cyan px-2.5 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 uppercase tracking-wider z-20">
                {lesson.moduleName}
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground">{lesson.title}</h3>

            <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {lesson.explanation}
            </div>

            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                Key Takeaways
              </h4>
              <ul className="space-y-2">
                {lesson.keyTakeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00F5A0]" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-xs text-aurora font-bold flex items-center gap-0.5">
                <Zap className="h-4 w-4" /> +{lesson.xp} XP reward
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
            <h3 className="text-base font-bold text-accent-cyan mb-2">
              Concept Check quiz
            </h3>
            <h4 className="text-base font-bold text-foreground mb-4">
              {lesson.quiz.question}
            </h4>

            <div className="space-y-3">
              {lesson.quiz.options.map((option, idx) => {
                const isChosen = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between',
                      isChosen
                        ? 'bg-accent-cyan/10 border-accent-cyan text-foreground'
                        : 'bg-navy-deep/30 border-white/5 text-muted-foreground hover:bg-white/5'
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
                    'mt-4 p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold border',
                    quizFeedback.type === 'success'
                      ? 'bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald'
                      : 'bg-rose-950/20 border-rose-900/30 text-rose-300'
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
                  <span className="text-xs text-accent-emerald font-bold">
                    🎉 Mastery Unlocked!
                  </span>
                  <button
                    onClick={onClose}
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
  );
}
