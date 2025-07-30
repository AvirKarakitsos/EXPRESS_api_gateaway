import db from '../database/connection';
import { Request, Response } from 'express';
import bcrypt from "bcrypt"

export const signup = async(req: Request, res: Response) => {
   const credentials = req.body

   try {
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      const stmt = db.prepare('INSERT INTO User (email, password) VALUES (?, ?)');
      stmt.run(credentials.email, hashedPassword);
      res.status(201).json({result: 'Utilisateur enregistré avec succès'});

   } catch (err: unknown) {
      if (err instanceof Error) {
          const dbErr = err as { code?: string; message: string };
          if (dbErr.code === 'SQLITE_CONSTRAINT_UNIQUE') {
             res.status(201).json({result : 'cet email est déjà utilisé.'});
          } else {
             console.error(dbErr.message);
             res.status(400).json({result: 'Erreur lors de l’enregistrement'})
          }
      }
   }

};

export const login = (req: Request, res: Response) => {
   res.status(201).json({result: "OK"})
};