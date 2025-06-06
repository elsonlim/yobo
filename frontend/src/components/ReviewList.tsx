import React from 'react';
import { Review } from '../services/reviewService';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  error: Error | null; // Or specific error type
  title?: string;
  onDelete?: (reviewId: string) => void; // Add onDelete prop
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading, error, title, onDelete }) => {
  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>Error fetching reviews: {error.message}</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews found.</p>;
  }

  return (
    <div>
      {title && <h2>{title}</h2>}
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} onDelete={onDelete} /> // Pass onDelete to ReviewCard
      ))}
    </div>
  );
};

export default ReviewList;
