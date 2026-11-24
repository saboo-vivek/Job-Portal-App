import React, { useState } from "react";
import { Review } from "../types";
import { Star, MessageSquare } from "lucide-react";
import { Button, Input, showToast } from "./ui";

interface LeaveReviewFormProps {
  companyName: string;
  onSubmit: (review: Omit<Review, "id" | "date" | "authorId">) => void;
  onCancel: () => void;
}

const LeaveReviewForm: React.FC<LeaveReviewFormProps> = ({
  companyName,
  onSubmit,
  onCancel,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast.error("Please select a star rating from 1 to 5.");
      return;
    }
    if (!reviewerName.trim() || !comment.trim()) {
      showToast.error("Please provide both your name and review feedback.");
      return;
    }
    onSubmit({ reviewerName: reviewerName.trim(), rating, comment: comment.trim() });
    showToast.success(`Thank you for reviewing ${companyName}!`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100">
        <p className="text-xs text-violet-700 font-semibold uppercase tracking-wider mb-0.5">
          Company Review
        </p>
        <p className="text-sm font-bold text-slate-900">
          Sharing your experience at <span className="text-primary">{companyName}</span>
        </p>
      </div>

      {/* Reviewer Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Your Name or Display Title
        </label>
        <Input
          id="reviewerName"
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="e.g. Senior Frontend Developer"
          required
        />
      </div>

      {/* Interactive Star Rating */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Overall Rating
        </label>
        <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  (hoverRating || rating) >= star
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-xs font-medium text-slate-600">
            {rating > 0
              ? `${rating} out of 5 stars`
              : "Click to select a score"}
          </span>
        </div>
      </div>

      {/* Review Body */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          Review & Detailed Feedback
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Describe company culture, work-life balance, leadership, compensation, and career growth..."
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Review
        </Button>
      </div>
    </form>
  );
};

export default LeaveReviewForm;
