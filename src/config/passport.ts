import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import passportFacebook from "passport-facebook";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

const GoogleStrategy = passportGoogle.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const prisma = new PrismaClient();
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/redirect",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Look for user by googleId
        const user = await prisma.user.findUnique({
          where: {
            googleId: profile.id,
          },
        });

        // If user doesn't exist, create a new user
        if (!user) {
          profile;
          const newUser = await prisma.user.create({
            data: {
              email: profile.emails[0].value, // Use emails array
              name: profile.displayName, // Use displayName for name
              googleId: profile.id,
              coverPhoto: profile.photos[0].value,
              password: null, // Ensure password is null
            },
          });
          return done(null, newUser); // Pass the new user to done
        }

        // If user exists, return the user
        done(null, user);
      } catch (error) {
        console.error("Error in Google strategy:", error); // Log the error
        done(error, null); // Pass the error to done
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email, id } = profile._json;

        const user = await prisma.user.findUnique({
          where: {
            facebookId: id,
          },
        });

        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              email: email,
              name: name,
              facebookId: id,
              coverPhoto: profile.photos[0].value,
              password: null,
              googleId: null,
            },
          });
          return done(null, newUser);
        }

        done(null, user);
      } catch (error) {
        console.log("error", error);
      }
    },
  ),
);

// Serialize the user into the session
passport.serializeUser((user, done) => {
  // In this case, we are saving the user.id to the session
  done(null, user.id);
});

// Deserialize the user from the session using the user id
passport.deserializeUser(async (id, done) => {
  try {
    // Fetch the user by ID from the database
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"));
    }
  } catch (error) {
    done(error, null);
  }
});
