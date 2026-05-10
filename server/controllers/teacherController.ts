import type {NextFunction, Response} from 'express';
import type {AuthenticatedRequest} from '../middlewares/auth.ts';
import {teacherRepository} from '../repositories/teacherRepository.ts';
import {parseReviewInput, parseTeacherDocumentSubmitInput, ValidationError} from '../validators/index.ts';

export function teacherOfficeController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getOffice(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到教师办公数据。'});
    return;
  }

  res.json(data);
}

export function teacherMeetingController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getMeeting(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到会议室数据。'});
    return;
  }

  res.json(data);
}

export function teacherDocumentController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getDocument(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到文件代送数据。'});
    return;
  }

  res.json(data);
}

export function submitTeacherDocumentController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseTeacherDocumentSubmitInput(req.body);
    const data = teacherRepository.submitDocument(req.user!, input);
    if (!data) {
      throw new ValidationError('未找到文件代送数据。', 404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export function teacherLeaveController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getLeave(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到请假审批数据。'});
    return;
  }

  res.json(data);
}

export function reviewTeacherLeaveController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseReviewInput(req.body);
    const data = teacherRepository.reviewLeave(req.user!, input);
    if (!data) {
      throw new ValidationError('未找到待审批的请假申请。', 404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export function teacherStudentAffairsController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getStudentAffairs(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到学生事务数据。'});
    return;
  }

  res.json(data);
}

export function reviewTeacherStudentAffairsController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseReviewInput(req.body);
    const data = teacherRepository.reviewStudentAffair(req.user!, input);
    if (!data) {
      throw new ValidationError('未找到待审批的学生事务申请。', 404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export function teacherStudyRoomController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getStudyRoom(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到研讨室数据。'});
    return;
  }

  res.json(data);
}

export function teacherSalaryController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getSalary(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到工资数据。'});
    return;
  }

  res.json(data);
}

export function teacherCampusCardController(req: AuthenticatedRequest, res: Response) {
  const data = teacherRepository.getCampusCard(req.user!);
  if (!data) {
    res.status(404).json({message: '未找到校园卡数据。'});
    return;
  }

  res.json(data);
}
