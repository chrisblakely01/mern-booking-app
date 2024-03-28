import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();// Création d'un routeur express
// Route for user login
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;// Extraction de l'email et du mot de passe de la requête

    try {
      // Find user by email
      const user = await User.findOne({ email });
       // If user not found, return error
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      // Compare password with hashed password stored in database
      const isMatch = await bcrypt.compare(password, user.password);
      // If passwords don't match, return error
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      // Return user ID in response
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
// Route to validate JWT token
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  // Return user ID extracted from token
  res.status(200).send({ userId: req.userId });
});

// Route to logout (clear authentication token)
router.post("/logout", (req: Request, res: Response) => {
  // Effacer authentication token en le définissant comme une chaîne vide et en l'expirant
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

export default router;
