import {
  getTeacherCampusCardData,
  getTeacherDocumentData,
  getTeacherLeaveData,
  getTeacherMeetingData,
  getTeacherOfficeData,
  getTeacherSalaryData,
  getTeacherStudentAffairsData,
  getTeacherStudyRoomData,
  reviewTeacherLeave,
  reviewTeacherStudentAffair,
  submitTeacherDocument,
} from '../services.ts';
import type {
  DatabaseShape,
  PublicUser,
  TeacherCampusCardRecord,
  TeacherDocumentRecord,
  TeacherLeaveRecord,
  TeacherMeetingRecord,
  TeacherOfficeRecord,
  TeacherSalaryRecord,
  TeacherStudentAffairsRecord,
  TeacherStudyRoomRecord,
} from '../types.ts';
import type {ReviewInput, TeacherDocumentSubmitInput} from '../validation.ts';
import {createRecordId} from '../utils.ts';
import {databaseRepository} from './databaseRepository.ts';

export interface TeacherRepository {
  getOffice: (user: PublicUser) => TeacherOfficeRecord | null;
  getMeeting: (user: PublicUser) => TeacherMeetingRecord | null;
  getDocument: (user: PublicUser) => TeacherDocumentRecord | null;
  submitDocument: (user: PublicUser, input: TeacherDocumentSubmitInput) => TeacherDocumentRecord | null;
  getLeave: (user: PublicUser) => TeacherLeaveRecord | null;
  reviewLeave: (user: PublicUser, input: ReviewInput) => TeacherLeaveRecord | null;
  getStudentAffairs: (user: PublicUser) => TeacherStudentAffairsRecord | null;
  reviewStudentAffair: (user: PublicUser, input: ReviewInput) => TeacherStudentAffairsRecord | null;
  getStudyRoom: (user: PublicUser) => TeacherStudyRoomRecord | null;
  getSalary: (user: PublicUser) => TeacherSalaryRecord | null;
  getCampusCard: (user: PublicUser) => TeacherCampusCardRecord | null;
}

export const teacherRepository: TeacherRepository = {
  getOffice(user) {
    return getTeacherOfficeData(databaseRepository.getSnapshot(), user.id);
  },

  getMeeting(user) {
    return getTeacherMeetingData(databaseRepository.getSnapshot(), user.id);
  },

  getDocument(user) {
    return getTeacherDocumentData(databaseRepository.getSnapshot(), user.id);
  },

  submitDocument(user, input) {
    let updated = false;
    const db = databaseRepository.update((draft) => {
      const data = submitTeacherDocument(draft, user.id, input);
      if (data) {
        updated = true;
        appendAuditLog(
          draft,
          'teacher.document.submit',
          user,
          `${user.username} 提交文件代送 ${input.pickupLocation} -> ${input.destinationLocation}`,
        );
      }
    });

    return updated ? db.teacherDocumentByUserId[user.id] ?? null : null;
  },

  getLeave(user) {
    return getTeacherLeaveData(databaseRepository.getSnapshot(), user.id);
  },

  reviewLeave(user, input) {
    let updated = false;
    const db = databaseRepository.update((draft) => {
      const data = reviewTeacherLeave(draft, user.id, input);
      if (data) {
        updated = true;
        appendAuditLog(
          draft,
          `teacher.leave.${input.decision}`,
          user,
          `${user.username} ${input.decision === 'approve' ? '批准' : '驳回'} 请假申请 ${input.applicationId}`,
        );
      }
    });

    return updated ? db.teacherLeaveByUserId[user.id] ?? null : null;
  },

  getStudentAffairs(user) {
    return getTeacherStudentAffairsData(databaseRepository.getSnapshot(), user.id);
  },

  reviewStudentAffair(user, input) {
    let updated = false;
    const db = databaseRepository.update((draft) => {
      const data = reviewTeacherStudentAffair(draft, user.id, input);
      if (data) {
        updated = true;
        appendAuditLog(
          draft,
          `teacher.student-affairs.${input.decision}`,
          user,
          `${user.username} ${input.decision === 'approve' ? '批准' : '驳回'} 学生事务申请 ${input.applicationId}`,
        );
      }
    });

    return updated ? db.teacherStudentAffairsByUserId[user.id] ?? null : null;
  },

  getStudyRoom(user) {
    return getTeacherStudyRoomData(databaseRepository.getSnapshot(), user.id);
  },

  getSalary(user) {
    return getTeacherSalaryData(databaseRepository.getSnapshot(), user.id);
  },

  getCampusCard(user) {
    return getTeacherCampusCardData(databaseRepository.getSnapshot(), user.id);
  },
};

function appendAuditLog(db: DatabaseShape, type: string, actor: PublicUser, detail: string): void {
  db.auditLogs.unshift({
    id: createRecordId('audit'),
    type,
    actorId: actor.id,
    detail,
    createdAt: new Date().toISOString(),
  });
}
