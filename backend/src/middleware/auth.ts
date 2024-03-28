import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Déclaration pour étendre l'interface Request du module Express
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}


// Middleware(fct qui s'exécute entre la réception d'une requête et l'envoi d'une réponse) pour vérifier le token d'authentification
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
   // Récupère le token d'authentification à partir des cookies de la requête
  const token = req.cookies["auth_token"];
  // Vérifie si le token n'est pas présent
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
     // Verifies the validity of the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    // Extrait l'id du user à partir des informations décodées du token
    req.userId = (decoded as JwtPayload).userId;
    // Calls the next function in the middleware chain
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default verifyToken;// Exporte la fonction verifyToken comme middleware
