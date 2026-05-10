import {Router} from 'express';
import {
  reviewTeacherLeaveController,
  reviewTeacherStudentAffairsController,
  submitTeacherDocumentController,
  teacherCampusCardController,
  teacherDocumentController,
  teacherLeaveController,
  teacherMeetingController,
  teacherOfficeController,
  teacherSalaryController,
  teacherStudentAffairsController,
  teacherStudyRoomController,
} from '../controllers/teacherController.ts';
import {requireTeacher} from '../middlewares/auth.ts';

export function createTeacherRouter() {
  const router = Router();

  router.use(requireTeacher);

  router.get('/office', teacherOfficeController);
  router.get('/meeting', teacherMeetingController);
  router.get('/document', teacherDocumentController);
  router.post('/document/submit', submitTeacherDocumentController);
  router.get('/leave', teacherLeaveController);
  router.post('/leave/review', reviewTeacherLeaveController);
  router.get('/student-affairs', teacherStudentAffairsController);
  router.post('/student-affairs/review', reviewTeacherStudentAffairsController);
  router.get('/study-room', teacherStudyRoomController);
  router.get('/salary', teacherSalaryController);
  router.get('/campus-card', teacherCampusCardController);

  return router;
}
