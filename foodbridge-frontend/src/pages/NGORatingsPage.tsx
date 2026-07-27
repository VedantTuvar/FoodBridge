import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { ratingApi } from '../api/ratingApi';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { useToast } from '../context/ToastContext';

export const NGORatingsPage = () => {
  const { addToast } = useToast();
  const [taskId, setTaskId] = useState('');
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  const submitMutation = useMutation({
    mutationFn: (data: any) => ratingApi.submitRating(data),
    onSuccess: () => {
      addToast({ type: 'success', title: 'Rating Submitted!', message: 'Thank you for building network trust.' });
      setTaskId('');
      setComment('');
    },
    onError: () => addToast({ type: 'error', title: 'Rating Submission Failed' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ task: taskId, score, comment });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto"
    >
      <div className="mb-6">
        <span className="font-mono text-xs text-amber-deep uppercase tracking-wider font-semibold">
          NETWORK QUALITY CONTROL
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Rate Delivery & Donor Quality
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Provide feedback on hygiene, packaging quality, and driver timeliness.
        </p>
      </div>

      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Task ID" placeholder="e.g. UUID from completed delivery task" value={taskId} onChange={(e) => setTaskId(e.target.value)} required />

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-ink-soft block mb-2 font-medium">
              Overall Score (1 to 5 Stars)
            </label>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setScore(s)}
                  className={`p-2 rounded-sm border transition-colors ${
                    s <= score ? 'bg-amber text-night border-amber' : 'bg-paper-alt text-ink-soft border-line'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <Input label="Comments / Feedback" placeholder="e.g. Excellent packaging and prompt delivery driver." value={comment} onChange={(e) => setComment(e.target.value)} />

          <Button type="submit" variant="primary" className="w-full" isLoading={submitMutation.isPending} leftIcon={<Send className="w-4 h-4" />}>
            Submit Feedback
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
