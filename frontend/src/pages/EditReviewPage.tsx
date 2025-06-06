import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm, { ReviewFormData } from '../components/ReviewForm';
import reviewService, { Review } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

const EditReviewPage: React.FC = () => {
  const { id: reviewId } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [review, setReview] = useState<Review | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reviewId) {
      setError("Review ID is missing.");
      setIsLoadingData(false);
      return;
    }

    const fetchReview = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const data = await reviewService.getReviewById(reviewId);
        setReview(data);
      } catch (err) {
        setError('Failed to fetch review data.');
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleSubmit = async (data: ReviewFormData) => {
    if (!reviewId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await reviewService.updateReview(reviewId, data);
      setIsSubmitting(false);
      // Redirect to home page or the updated review's page
      navigate('/'); // Or navigate(`/reviews/${reviewId}`);
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to update review. Please try again.');
      console.error(err);
    }
  };

  if (authLoading || isLoadingData) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>You must be logged in to edit a review. <a href={`${import.meta.env.VITE_AUTH_BASE_URL}/auth/google`}>Login</a></p>;
  }

  if (!review) {
    return <p>{error || 'Review not found.'}</p>;
  }

  // Check if the logged-in user is the author of the review
  // The author ID might be a string or an object depending on population
  const authorId = typeof review.author === 'string' ? review.author : review.author?._id ?? review.author?.id;
  if (user.id !== authorId) {
     return <p>You are not authorized to edit this review.</p>;
  }

  return (
    <div className="edit-review-page"> {/* Added class for page specific styling */}
      <h2>Edit Review</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ReviewForm
        onSubmit={handleSubmit}
        initialData={review}
        isLoading={isSubmitting}
        submitButtonText="Update Review"
      />
    </div>
  );
};

export default EditReviewPage;
