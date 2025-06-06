import { Router, Request, Response } from 'express';
import passport from '../config/passport'; // Adjusted path

const router = Router();

// Initiates Google OAuth flow
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handles the callback from Google
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), // Assuming a '/login' route for failure
  (req: Request, res: Response) => {
    // Successful authentication, redirect home or to a dashboard.
    res.redirect('/'); // Or wherever you want to redirect after login
  }
);

// Logs out the user
router.get('/auth/logout', (req: Request, res: Response, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/'); // Redirect to homepage or login page
  });
});

// A route to get the currently logged-in user
router.get('/auth/current-user', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
});

export default router;
