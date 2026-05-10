import type {NextFunction, Request, Response} from 'express';
import {authRepository} from '../repositories/authRepository.ts';
import type {PublicUser, UserRole} from '../types.ts';
import {getUserRole} from '../utils.ts';

export interface AuthenticatedRequest extends Request {
  authToken?: string;
  user?: PublicUser | null;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  const user = token ? authRepository.findUserByToken(token) : null;

  if (!token || !user) {
    res.status(401).json({message: '登录已失效，请重新登录。'});
    return;
  }

  req.authToken = token;
  req.user = user;
  next();
}

export function requireTeacher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user || getUserRole(req.user) !== 'teacher') {
      res.status(403).json({message: '当前页面仅限教师账号访问。'});
      return;
    }

    next();
  });
}

export function requireCampusUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const role = req.user ? getUserRole(req.user) : null;
    if (role !== 'student' && role !== 'teacher') {
      res.status(403).json({message: 'Current account can only access administrator resources.'});
      return;
    }

    next();
  });
}

export function requireRole(role: UserRole) {
  return function roleMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    requireAuth(req, res, () => {
      if (!req.user || getUserRole(req.user) !== role) {
        res.status(403).json({message: 'Current account does not have permission to access this resource.'});
        return;
      }

      next();
    });
  };
}
