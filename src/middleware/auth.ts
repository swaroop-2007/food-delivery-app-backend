import { auth } from "express-oauth2-jwt-bearer";
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user";
import { request } from "http";

declare global {
  namespace Express{
    interface Request{
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE as string,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL as string,
    tokenSigningAlg: 'RS256'
  });

  export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;

    if(!authorization || !authorization.startsWith("Bearer ")) {
      return res.sendStatus(401);
    }

    const token = authorization.split(" ")[1];

    try{
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const auth0Id = decoded.sub;
      const user = await User.findOne({auth0Id});

      if(!user){
        return res.sendStatus(401);
      }

      req.auth0Id = auth0Id as string;
      req.userId = user._id.toString();
      next();
    }
    catch(err) {
      return res.sendStatus(401);
    }
    
  };