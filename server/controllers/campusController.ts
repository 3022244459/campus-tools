import type {NextFunction, Response} from 'express';
import type {AuthenticatedRequest} from '../middlewares/auth.ts';
import {campusRepository} from '../repositories/campusRepository.ts';
import {
  parseCompareInput,
  parseLostFoundSubmitInput,
  parseRepairSubmitInput,
  parseTakeoutSubmitInput,
  parseUtilityReminderInput,
  parseWalletDebitInput,
  parseWalletRechargeInput,
} from '../validators/index.ts';

export function homeBootstrapController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getHomeBootstrap(req.user!));
}

export function navigationController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getNavigation(req.user!));
}

export function serviceCenterController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getServiceCenter(req.user!));
}

export function takeoutController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getTakeout(req.user!));
}

export function submitTakeoutController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseTakeoutSubmitInput(req.body);
    res.json(campusRepository.submitTakeout(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function repairController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getRepair(req.user!));
}

export function submitRepairController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseRepairSubmitInput(req.body);
    res.json(campusRepository.submitRepair(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function lostFoundController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getLostFound(req.user!));
}

export function submitLostFoundController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseLostFoundSubmitInput(req.body);
    res.json(campusRepository.submitLostFound(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function userActivityController(req: AuthenticatedRequest, res: Response) {
  const data = campusRepository.getUserActivity(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到当前账号的活动记录。'});
    return;
  }

  res.json(data);
}

export function courierController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getCourier(req.user!));
}

export function walletController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getWallet(req.user!));
}

export function rechargeWalletController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseWalletRechargeInput(req.body);
    res.json(campusRepository.rechargeWallet(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function withdrawWalletController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseWalletDebitInput(req.body);
    res.json(campusRepository.withdrawWallet(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function payWalletController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseWalletDebitInput(req.body);
    res.json(campusRepository.payWallet(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function rewardWalletController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseWalletRechargeInput(req.body);
    res.json(campusRepository.rewardWallet(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function utilitiesController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getUtilities(req.user!));
}

export function rechargeWaterController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseWalletRechargeInput(req.body);
    res.json(campusRepository.rechargeWater(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function payElectricityController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseWalletRechargeInput(req.body);
    res.json(campusRepository.payElectricity(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function electricityReminderController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseUtilityReminderInput(req.body);
    res.json(campusRepository.setElectricityReminder(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function compareQuoteController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseCompareInput(req.body);
    res.json(campusRepository.quoteCourier(req.user!, input));
  } catch (error) {
    next(error);
  }
}

export function documentDeliveryController(req: AuthenticatedRequest, res: Response) {
  res.json(campusRepository.getDocumentDelivery(req.user!));
}
