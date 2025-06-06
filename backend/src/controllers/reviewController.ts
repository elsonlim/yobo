import { Request, Response } from 'express';
import Review, { IReview } from '../models/Review';
import { IUser } from '../models/User'; // Assuming IUser is exported from User model

// Middleware to check if user is authenticated
export const ensureAuthenticated = (req: Request, res: Response, next: () => void) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Middleware to check if the authenticated user is the author of the review
export const ensureAuthor = async (req: Request, res: Response, next: () => void) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    // Ensure req.user is defined and has an id property
    if (req.user && (req.user as IUser).id.toString() === review.author.toString()) {
      return next();
    }
    res.status(403).json({ message: 'Forbidden: You are not the author of this review' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying author', error });
  }
};


// POST /api/reviews - Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { title, content, rating, yobo } = req.body;
    const author = (req.user as IUser).id; // Get user ID from authenticated user

    // Basic validation
    if (!title || !content || rating === undefined) {
      return res.status(400).json({ message: 'Title, content, and rating are required' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const newReview: IReview = new Review({
      title,
      content,
      rating,
      author,
      yobo: yobo || false,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

// GET /api/reviews - Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { yobo, sortBy, order = 'desc' } = req.query;
    const filter: any = {};
    const sort: any = {};

    if (yobo !== undefined) {
      filter.yobo = yobo === 'true';
    }

    if (sortBy) {
      sort[sortBy as string] = order === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    const reviews = await Review.find(filter).populate('author', 'displayName email').sort(sort);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// GET /api/reviews/best - Get best-rated reviews
export const getBestReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .populate('author', 'displayName email');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching best reviews', error });
  }
};

// GET /api/reviews/worst - Get worst-rated reviews (yobo=true)
export const getWorstYoboReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ rating: { $lte: 2 }, yobo: true })
      .sort({ rating: 1, createdAt: -1 })
      .limit(10)
      .populate('author', 'displayName email');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worst yobo reviews', error });
  }
};

// GET /api/reviews/:id - Get a specific review by ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id).populate('author', 'displayName email');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    // Handle CastError if the ID format is invalid
    if (error instanceof Error && error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid review ID format' });
    }
    res.status(500).json({ message: 'Error fetching review', error });
  }
};

// PUT /api/reviews/:id - Update a review by ID
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { title, content, rating, yobo } = req.body;

    // Basic validation
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const updatedFields: any = {};
    if (title !== undefined) updatedFields.title = title;
    if (content !== undefined) updatedFields.content = content;
    if (rating !== undefined) updatedFields.rating = rating;
    if (yobo !== undefined) updatedFields.yobo = yobo;

    // Ensure there's something to update
    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    updatedFields.updatedAt = new Date();


    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).populate('author', 'displayName email');

    if (!review) {
      return res.status(404).json({ message: 'Review not found or no changes made' });
    }
    res.status(200).json(review);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid review ID format' });
    }
    res.status(500).json({ message: 'Error updating review', error });
  }
};

// DELETE /api/reviews/:id - Delete a review by ID
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid review ID format' });
    }
    res.status(500).json({ message: 'Error deleting review', error });
  }
};
