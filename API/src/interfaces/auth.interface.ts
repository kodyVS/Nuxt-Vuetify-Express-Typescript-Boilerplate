import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { JwtPayload } from 'jsonwebtoken';
export interface DataStoredInToken {
  _id: string;
  userRole: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
export interface ReturnedCookie {
  token: string;
  options: {
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    domain: string;
  };
}
export interface JWTPayloadWithUser extends JwtPayload {
  _id: string;
  userRole: string;
}
