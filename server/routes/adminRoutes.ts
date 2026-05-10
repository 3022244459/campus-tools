import {Router} from 'express';
import {
  adminAuditLogsController,
  adminMetricsController,
  adminOverviewController,
  adminUsersController,
  publishAnnouncementController,
  revokeUserSessionsController,
} from '../controllers/adminController.ts';
import {requireRole} from '../middlewares/auth.ts';

export function createAdminRouter() {
  const router = Router();

  router.get('/overview', requireRole('admin'), adminOverviewController);
  router.get('/metrics', requireRole('admin'), adminMetricsController);
  router.get('/audit-logs', requireRole('admin'), adminAuditLogsController);
  router.get('/users', requireRole('admin'), adminUsersController);
  router.post('/users/:userId/revoke-sessions', requireRole('admin'), revokeUserSessionsController);
  router.post('/announcements', requireRole('admin'), publishAnnouncementController);

  return router;
}
