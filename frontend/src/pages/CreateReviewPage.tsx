import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewForm, { ReviewFormData } from '../components/ReviewForm';
import reviewService from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

const CreateReviewPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newReview = await reviewService.createReview(data);
      setIsSubmitting(false);
      // Redirect to home page or the new review's page (if available)
      // For simplicity, redirecting to home for now.
      // If you have a page for individual reviews, you could use: navigate(`/reviews/${newReview._id}`);
      navigate('/');
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to create review. Please try again.');
      console.error(err);
    }
  };

  if (authLoading) {
    return <p>Loading authentication status...</p>;
  }

  if (!user) {
    // Could also redirect to login page
    return <p>You must be logged in to create a review. <a href={`${import.meta.env.VITE_AUTH_BASE_URL}/auth/google`}>Login</a></p>;
  }

  return (
    <div className="create-review-page"> {/* Added class for page specific styling */}
      <h2>Create New Review</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ReviewForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitButtonText="Create Review"
      />
    </div>
  );
};

export default CreateReviewPage;
