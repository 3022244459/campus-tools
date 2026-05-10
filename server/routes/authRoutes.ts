import {Router} from 'express';
import {currentUserController, loginController, logoutController} from '../controllers/authController.ts';
import {requireAuth} from '../middlewares/auth.ts';

export function createAuthRouter() {
  const router = Router();

  router.post('/login', loginController);
  router.post('/logout', requireAuth, logoutController);
  router.get('/me', requireAuth, currentUserController);

  return router;
}
