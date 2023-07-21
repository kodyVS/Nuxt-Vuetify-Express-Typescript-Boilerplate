import { CookieOptions, NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { catchAsync } from '@utils/catchAsync';
export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData: User = req.body;
    const signUpUserData: User = await this.auth.signup(userData);

    res.status(201).json({ data: signUpUserData, message: 'signup' });
  });
  public autoLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await this.auth.autoLogin(req);
    res.status(200).json({ data: currentUser });
  });
  public logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData: User = req.body;
    const { cookie, findUser } = await this.auth.login(userData);
    const cookieOptions: CookieOptions = cookie.options;
    res.cookie('jwt', cookie.token, cookieOptions);
    //res.setHeader('Set-Cookie', [cookie]);
    res.status(200).json({ data: findUser, message: 'logged in' });
  });

  public logOut = catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log('loggedout');
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    res.status(200).json({ data: { status: 'success' }, message: 'logout' });
  });
}
