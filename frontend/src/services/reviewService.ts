import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g., http://localhost:3000/api

// Define a type for the Review object for better type safety
// This should match the backend IReview interface, excluding methods and potentially with populated author
export interface Review {
  _id: string;
  title: string;
  content: string;
  rating: number;
  author: {
    _id?: string; // Optional if not always populated or if only ID is sent
    id?: string; // Mongoose might use 'id' or '_id'
    displayName: string;
    email?: string; // Optional based on population
  } | string; // Author might be just an ID or a populated object
  yobo: boolean;
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
}

const reviewService = {
  // GET /api/reviews - Get all reviews (with potential query params)
  getAllReviews: async (params?: { yobo?: boolean; sortBy?: string; order?: 'asc' | 'desc' }): Promise<Review[]> => {
    try {
      const response = await axios.get<Review[]>(`${API_BASE_URL}/reviews`, {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      throw error;
    }
  },

  // GET /api/reviews/best - Get best-rated reviews
  getBestReviews: async (): Promise<Review[]> => {
    try {
      const response = await axios.get<Review[]>(`${API_BASE_URL}/reviews/best`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching best reviews:', error);
      throw error;
    }
  },

  // GET /api/reviews/worst - Get worst-rated yobo reviews
  getWorstYoboReviews: async (): Promise<Review[]> => {
    try {
      const response = await axios.get<Review[]>(`${API_BASE_URL}/reviews/worst`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching worst yobo reviews:', error);
      throw error;
    }
  },

  // GET /api/reviews/:id - Get a specific review by ID
  getReviewById: async (id: string): Promise<Review> => {
    try {
      const response = await axios.get<Review>(`${API_BASE_URL}/reviews/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching review by ID ${id}:`, error);
      throw error;
    }
  },

  // POST /api/reviews - Create a new review
  createReview: async (reviewData: { title: string; content: string; rating: number; yobo?: boolean }): Promise<Review> => {
    try {
      const response = await axios.post<Review>(`${API_BASE_URL}/reviews`, reviewData, {
        withCredentials: true, // Important for sending session cookie for authentication
      });
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // PUT /api/reviews/:id - Update a review by ID
  updateReview: async (id: string, reviewData: Partial<Review>): Promise<Review> => {
    try {
      const response = await axios.put<Review>(`${API_BASE_URL}/reviews/${id}`, reviewData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/reviews/:id - Delete a review by ID
  deleteReview: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/reviews/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  },
};

export default reviewService;
