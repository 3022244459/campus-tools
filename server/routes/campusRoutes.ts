import {Router} from 'express';
import {
  compareQuoteController,
  courierController,
  electricityReminderController,
  homeBootstrapController,
  lostFoundController,
  navigationController,
  payWalletController,
  payElectricityController,
  rechargeWalletController,
  rechargeWaterController,
  repairController,
  serviceCenterController,
  submitLostFoundController,
  submitRepairController,
  submitTakeoutController,
  takeoutController,
  userActivityController,
  utilitiesController,
  walletController,
  withdrawWalletController,
} from '../controllers/campusController.ts';
import {requireCampusUser} from '../middlewares/auth.ts';

export function createCampusRouter() {
  const router = Router();

  router.use(requireCampusUser);

  router.get('/home/bootstrap', homeBootstrapController);
  router.get('/navigation', navigationController);
  router.get('/service-center', serviceCenterController);
  router.get('/takeout', takeoutController);
  router.post('/takeout/submit', submitTakeoutController);
  router.get('/repair', repairController);
  router.post('/repair/submit', submitRepairController);
  router.get('/lost-found', lostFoundController);
  router.post('/lost-found/submit', submitLostFoundController);
  router.get('/me/activity', userActivityController);
  router.get('/courier', courierController);
  router.get('/wallet', walletController);
  router.post('/wallet/recharge', rechargeWalletController);
  router.post('/wallet/withdraw', withdrawWalletController);
  router.post('/wallet/pay', payWalletController);
  router.get('/utilities', utilitiesController);
  router.post('/utilities/water/recharge', rechargeWaterController);
  router.post('/utilities/electricity/pay', payElectricityController);
  router.post('/utilities/electricity/reminder', electricityReminderController);
  router.post('/courier-compare/quote', compareQuoteController);

  return router;
}
