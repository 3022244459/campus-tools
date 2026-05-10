import type {NextFunction, Request, Response} from 'express';
import type {AuthenticatedRequest} from '../middlewares/auth.ts';
import {authRepository} from '../repositories/authRepository.ts';
import {parseLoginInput} from '../validators/index.ts';

export function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseLoginInput(req.body);
    const loginResult = authRepository.loginWithPassword(input.identity, input.username, input.password);

    if (!loginResult) {
      res.status(401).json({message: '账号、密码或身份不正确。'});
      return;
    }

    res.json({
      token: loginResult.session.token,
      expiresAt: loginResult.session.expiresAt,
      user: loginResult.user,
    });
  } catch (error) {
    next(error);
  }
}

export function logoutController(req: AuthenticatedRequest, res: Response) {
  if (req.authToken) {
    authRepository.endSession(req.authToken, req.user);
  }

  res.status(204).end();
}

export function currentUserController(req: AuthenticatedRequest, res: Response) {
  res.json({user: req.user});
}
