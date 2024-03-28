import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();// Création d'un routeur Express

// Route pour récupérer les informations de l'utilisateur actuellement connecté
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    // Recherche de l'utilisateur dans la base de données par son ID
    const user = await User.findById(userId).select("-password");
    if (!user) {
      // Retourne une erreur si l'utilisateur n'est pas trouvé
      return res.status(400).json({ message: "User not found" });
    }
    // Retourne les informations de l'utilisateur
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

// Route pour l'inscription d'un nouvel utilisateur
router.post(
  "/register",
  [ // Validation des champs du formulaire d'inscription
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Retourne les erreurs de validation si le formulaire est invalide
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        // Vérifie si l'utilisateur existe déjà dans la base de données
        return res.status(400).json({ message: "User already exists" });
      }

      // Création d'un nouvel utilisateur avec les données du formulaire
      user = new User(req.body);
      await user.save();

      // Génération d'un jeton d'authentification pour l'utilisateur nouvellement inscrit
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      // Configuration du cookie d'authentification
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      return res.status(200).send({ message: "User registered OK" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);
// Export du routeur pour être utilisé dans d'autres fichiers
export default router;
