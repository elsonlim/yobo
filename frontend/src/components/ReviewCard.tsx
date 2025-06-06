import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Review } from '../services/reviewService';
import reviewService from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  onDelete?: (reviewId: string) => void; // Optional callback after deletion
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const authorName = typeof review.author === 'string' ? 'Unknown User' : review.author?.displayName || 'Anonymous';
  const authorId = typeof review.author === 'string' ? review.author : review.author?._id ?? review.author?.id;

  const isAuthor = user && user.id === authorId;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(review._id);
        if (onDelete) {
          onDelete(review._id);
        }
        // Optionally, show a success message or redirect
        // navigate('/'); // Or refetch list, depending on parent component's logic
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <h3 className="review-title">{review.title}</h3>
        {isAuthor && (
          <div className="review-actions">
            <Link to={`/reviews/edit/${review._id}`} className="review-action-btn edit-btn">Edit</Link>
            <button onClick={handleDelete} className="review-action-btn delete-btn">Delete</button>
          </div>
        )}
      </div>
      <p className="review-rating"><strong>Rating:</strong> {'⭐'.repeat(review.rating)}{'☆'.repeat(5-review.rating)} ({review.rating}/5)</p>
      <p className="review-content">{review.content}</p>
      <p className="review-author"><em>By: {authorName}</em></p>
      {review.yobo && <p className="review-yobo">YOBO Review!</p>}
      <p className="review-timestamps">
        <small>Posted: {new Date(review.createdAt).toLocaleDateString()}</small>
        {review.createdAt !== review.updatedAt && (
          <small className="timestamp-updated">(Updated: {new Date(review.updatedAt).toLocaleDateString()})</small>
        )}
      </p>
    </div>
  );
};

export default ReviewCard;
