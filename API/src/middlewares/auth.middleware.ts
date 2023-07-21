import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { JWTPayloadWithUser, RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';

const getAuthorization = (req: Request) => {
  let token: string;
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split('; ');
    cookies.forEach(cookie => {
      if (cookie === 'jwt=loggedout') {
        return;
      }
      if (cookie.slice(0, 4) === 'jwt=') {
        token = cookie.substring(4);
      }
    });
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return null;
  }

  return token;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { _id } = (await verify(Authorization, SECRET_KEY)) as JWTPayloadWithUser;
      const findUser = await UserModel.findById(_id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const AuthUserRoleMiddleware = role => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = getAuthorization(req);

      if (Authorization) {
        const { _id } = (await verify(Authorization, SECRET_KEY)) as JWTPayloadWithUser;
        const findUser = await UserModel.findById(_id);

        if (findUser) {
          if (findUser.userRole === role || findUser.userRole === 'admin') {
            next();
          } else {
            next(new HttpException(403, 'Unauthorized'));
          }
        } else {
          next(new HttpException(401, 'Wrong authentication token'));
        }
      } else {
        next(new HttpException(404, 'Authentication token missing'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };
};
