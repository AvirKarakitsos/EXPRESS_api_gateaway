// import db from '../database/connection.js';
import { Request, Response } from 'express';

export const signup = (req: Request, res: Response) => {
   res.status(201).json({result: "OK"})
};

export const login = (req: Request, res: Response) => {
   res.status(201).json({result: "OK"})
};