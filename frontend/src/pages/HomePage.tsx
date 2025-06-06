import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import reviewService, { Review } from '../services/reviewService';
import ReviewList from '../components/ReviewList';
import { useAuth } from '../contexts/AuthContext'; // To display user info or tailor content

const HomePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth(); // Get user info if needed

  const [bestReviews, setBestReviews] = useState<Review[]>([]);
  const [worstYoboReviews, setWorstYoboReviews] = useState<Review[]>([]);
  const [isLoadingBest, setIsLoadingBest] = useState(true); // Renamed for clarity
  const [isLoadingWorst, setIsLoadingWorstYobo] = useState(true); // Renamed for clarity
  const [errorBest, setErrorBestReviews] = useState<Error | null>(null); // Renamed for clarity
  const [errorWorst, setErrorWorstYobo] = useState<Error | null>(null); // Renamed for clarity

  const fetchAllReviews = useCallback(async () => {
    setIsLoadingBest(true);
    setErrorBestReviews(null);
    try {
      const data = await reviewService.getBestReviews();
      setBestReviews(data);
    } catch (err) {
      setErrorBestReviews(err as Error);
    } finally {
      setIsLoadingBest(false);
    }

    setIsLoadingWorstYobo(true);
    setErrorWorstYobo(null);
    try {
      const data = await reviewService.getWorstYoboReviews();
      setWorstYoboReviews(data);
    } catch (err) {
      setErrorWorstYobo(err as Error);
    } finally {
      setIsLoadingWorstYobo(false);
    }
  }, []);


  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const handleReviewDeleted = (deletedReviewId: string) => {
    // Refetch or filter out the deleted review from local state
    setBestReviews(prev => prev.filter(review => review._id !== deletedReviewId));
    setWorstYoboReviews(prev => prev.filter(review => review._id !== deletedReviewId));
    // Or, more robustly:
    // fetchAllReviews();
  };

  if (authLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user && (
        <div style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
          <h2>Welcome back, {user.displayName}!</h2>
          <Link to="/reviews/create" style={{textDecoration: 'none'}}>
            <button>+ Create New Review</button>
          </Link>
        </div>
      )}
      {!user && <p>Welcome! Log in to create and manage your reviews.</p>}

      <section>
        <ReviewList
          title="🌟 Top Rated Reviews 🌟"
          reviews={bestReviews}
          isLoading={isLoadingBest}
          error={errorBest}
          onDelete={handleReviewDeleted}
        />
      </section>

      <hr style={{ margin: '20px 0' }}/>

      <section>
         <ReviewList
          title="🔥 Worst Rated (YOBO'd) Reviews 🔥"
          reviews={worstYoboReviews}
          isLoading={isLoadingWorst}
          error={errorWorst}
          onDelete={handleReviewDeleted}
        />
      </section>
    </div>
  );
};

export default HomePage;
