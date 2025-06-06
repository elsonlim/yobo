import React, { useState, useEffect } from 'react';
import { Review } from '../services/reviewService'; // Assuming Review type is available

// Define the structure of the form data
export interface ReviewFormData {
  title: string;
  content: string;
  rating: number;
  yobo: boolean;
}

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>; // Make onSubmit async
  initialData?: Partial<Review>; // For editing, can be a partial Review
  submitButtonText?: string;
  isLoading?: boolean; // To disable form during submission
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  initialData,
  submitButtonText = 'Submit Review',
  isLoading = false
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(3); // Default rating
  const [yobo, setYobo] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setRating(initialData.rating || 3);
      setYobo(initialData.yobo || false);
    }
  }, [initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Title and content cannot be empty.');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }
    await onSubmit({ title, content, rating, yobo });
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isLoading}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="rating">Rating (1-5):</label>
        <input
          id="rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
          min="1"
          max="5"
          required
          disabled={isLoading}
          className="form-control"
        />
        {/* Alternatively, use radio buttons or a select for rating */}
      </div>
      <div className="form-group form-check">
        <input
          id="yobo"
          type="checkbox"
          checked={yobo}
          onChange={(e) => setYobo(e.target.checked)}
          disabled={isLoading}
          className="form-check-input"
        />
        <label htmlFor="yobo" className="form-check-label">Mark as YOBO?</label>
      </div>
      <button type="submit" disabled={isLoading} className="btn btn-primary submit-btn">
        {isLoading ? 'Submitting...' : submitButtonText}
      </button>
    </form>
  );
};

export default ReviewForm;
