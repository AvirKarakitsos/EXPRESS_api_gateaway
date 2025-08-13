import db from '../database/connection';
import { Request, Response } from 'express';
import bcrypt from "bcrypt"
import fs from "node:fs"
import jwt, {Algorithm} from "jsonwebtoken"

interface User {
  id: number;
  email: string;
  password: string; // mot de passe hashé
}

export const index = (req: Request, res: Response) => {
   const token = req.cookies.token;
   console.log(token)
   if (!token) return res.sendStatus(401); // Unauthorized
   else return res.status(201).json({result: 'tout est OK'})
}

export const signup = async (req: Request, res: Response) => {
   const credentials = req.body


   try {
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      const sql = db.prepare('INSERT INTO User (email, password) VALUES (?, ?)');
      sql.run(credentials.email, hashedPassword);

      res.status(201).json({result: 'Utilisateur enregistré avec succès'});

   } catch (err: unknown) {
      if (err instanceof Error) {
          const dbErr = err as { code?: string; message: string };
          if (dbErr.code === 'SQLITE_CONSTRAINT_UNIQUE') {
             res.status(400).json({result : 'cet email est déjà utilisé.'});
          } else {
             console.error(dbErr.message);
             res.status(400).json({result: 'Erreur lors de l’enregistrement'})
          }
      }
   }
};

export const login = async (req: Request, res: Response) => {
   const credentials = req.body
   
   try {
      const sql = db.prepare('SELECT * FROM User WHERE email = ?');
      const user = sql.get(credentials.email) as User | undefined;
      
      if (!user) {
				res.status(401).json({ message: 'Paire email/mot de passe incorrecte'})
		} else {
         const isValid = await bcrypt.compare(credentials.password,user.password)

          if (!isValid) {
             res.status(401).json({result: 'Paire email/mot de passe incorrecte'});
            } else {
               const secret = fs.readFileSync('./one.pem');
               const durationAccess: number = 60 * 10;
               const durationRefresh: number = 60 * 60 * 24;

               const accessToken = jwt.sign(
                  { userId: user.id },
                  secret,
                  { expiresIn: durationAccess, algorithm: 'RS256' }
               )

               const refreshToken = jwt.sign(
                  { userId: user.id },
                  secret,
                  { expiresIn: durationRefresh, algorithm: 'RS256' }
               )

               res.cookie('accessToken', accessToken, {
                  httpOnly: true,        
                  secure: false,         
                  maxAge: durationAccess      
               });
               res.cookie('refreshToken', accessToken, {
                  httpOnly: true,        
                  secure: false,         
                  maxAge: durationRefresh      
               });

               res.status(200).json({result: 'Authentification réussie'});
         }
      }

   } catch (err: unknown) {
      if (err instanceof Error) {
         console.error(err.message);

         res.status(500).json({result: 'Erreur lors de l’enregistrement'})
      
      }
   }
};