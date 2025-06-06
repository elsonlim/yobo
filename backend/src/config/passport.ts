import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails && profile.emails[0].value,
        });
        await user.save();
        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user as IUser);
  } catch (error) {
    done(error, undefined);
  }
});

export default passport;
