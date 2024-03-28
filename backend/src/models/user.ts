import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserType } from "../shared/types";

// Définition du schema mongoose pour les utilisateurs
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
// Middleware exécuté avant de sauvegarder un utilisateur dans la base de données
userSchema.pre("save", async function (next) {
  // Vérifie si le mot de passe a été modifié avant de le hasher
  if (this.isModified("password")) {
    // Hashage du mot de passe avec bcrypt avant de le sauvegarder
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Création d'un modèle mongoose pour les utilisateurs basé sur le schéma défini
const User = mongoose.model<UserType>("User", userSchema);

export default User; // Export du modèle d'utilisateur
