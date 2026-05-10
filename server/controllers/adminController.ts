import type {NextFunction, Response} from 'express';
import type {AuthenticatedRequest} from '../middlewares/auth.ts';
import {adminRepository} from '../repositories/adminRepository.ts';
import {
  parseAdminUserSessionRevokeInput,
  parseAdminUsersQuery,
  parseAnnouncementSubmitInput,
  parseAuditLogQuery,
  ValidationError,
} from '../validators/index.ts';

export function adminOverviewController(_req: AuthenticatedRequest, res: Response) {
  res.json(adminRepository.getOverview());
}

export function adminMetricsController(_req: AuthenticatedRequest, res: Response) {
  res.json(adminRepository.getMetrics());
}

export function adminAuditLogsController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseAuditLogQuery(req.query);
    res.json({items: adminRepository.getAuditLogs(input)});
  } catch (error) {
    next(error);
  }
}

export function adminUsersController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseAdminUsersQuery(req.query);
    res.json(adminRepository.getUsers(input));
  } catch (error) {
    next(error);
  }
}

export function revokeUserSessionsController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseAdminUserSessionRevokeInput(req.params);
    if (input.userId === req.user!.id) {
      throw new ValidationError('Admins cannot revoke their own active sessions from this endpoint.');
    }

    const result = adminRepository.revokeUserSessions(req.user!, input);
    if (!result) {
      res.status(404).json({message: 'User was not found.'});
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function publishAnnouncementController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseAnnouncementSubmitInput(req.body);
    res.status(201).json(adminRepository.publishAnnouncement(req.user!, input));
  } catch (error) {
    next(error);
  }
}
