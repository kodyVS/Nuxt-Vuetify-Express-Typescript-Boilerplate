import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY, DOMAIN } from '@config';
import { HttpException } from '@exceptions/httpException';
import { ReturnedCookie, DataStoredInToken, TokenData, JWTPayloadWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { Request } from 'express';
import { promisify } from 'util';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id, userRole: user.userRole };
  const expiresIn: number = 60 * 60 * 24 * 30;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): ReturnedCookie => {
  return {
    token: tokenData.token,
    options: {
      expires: new Date(Date.now() + tokenData.expiresIn),
      httpOnly: true,
      secure: true,
      domain: DOMAIN,
    },
  };
};

@Service()
export class AuthService {
  public async signup(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createUserData: User = await UserModel.create({ ...userData });
    createUserData.password = undefined;
    return createUserData;
  }

  public async login(userData: User): Promise<{ cookie: ReturnedCookie; findUser: User }> {
    const findUser: User = await UserModel.findOne({ email: userData.email }).select('+password');
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await findUser.correctPassword(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');
    findUser.password = undefined;
    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public async autoLogin(req: Request): Promise<User> {
    let token;
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split('; ');
      cookies.forEach(cookie => {
        if (cookie === 'jwt=loggedout') {
          throw new HttpException(403, 'Logged out');
        }
        if (cookie.slice(0, 4) === 'jwt=') {
          token = cookie.substring(4);
        }
      });
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new HttpException(403, `Not Authorized`);
    }
    // 2) Verification token
    let decoded: JWTPayloadWithUser;
    try {
      const verifyCallbackStyle = (token, secretKey, callback) => {
        verify(token, secretKey, (error, decoded) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, decoded);
          }
        });
      };

      const verifyPromisified = promisify(verifyCallbackStyle);
      decoded = (await verifyPromisified(token, SECRET_KEY)) as JWTPayloadWithUser;
    } catch (err) {
      throw new HttpException(403, `${err.message}`);
    }
    if (!decoded) {
      throw new HttpException(404, `Error decoding message`);
    }

    const currentUser = await UserModel.findById(decoded._id);
    if (!currentUser) {
      throw new HttpException(404, `No user Found`);
    }
    return currentUser;
  }
}
