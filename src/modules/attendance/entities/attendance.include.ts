import { SessionSchedule } from '../../session-schedule/entities/session-schedule.entity';
import { SessionInstance } from '../../session-instance/entities/session-instance.entity';
import { SessionParticipant } from '../../session-participant/entities/session-participant.entity';
import { Session } from '../../session/entities/session.entity';
import { Club } from '../../club/entities/club.entity';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../../shared/helpers/roles.enum';

export const ATTENDANCE_INCLUDE = {
  create: () => {
    return [];
  },
  getOne: () => {
    return [];
  },
  getAll: () => {
    return [];
  },
  getAllByClub: (clubId: string) => {
    return [
      {
        model: SessionInstance,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: SessionSchedule,
            attributes: ['id'],
            required: true,
            include: [
              {
                model: Session,
                attributes: ['id'],
                required: true,
                where: { clubId },
              },
            ],
          },
        ],
      },
    ];
  },
  getAllByStudent: (studentId: string) => {
    return [
      {
        model: SessionParticipant,
        attributes: ['id'],
        required: true,
        where: { clubStudentId: studentId },
      },
    ];
  },
  getAllBySession: (sessionId: string) => {
    return [
      {
        model: SessionInstance,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: SessionSchedule,
            attributes: ['id'],
            required: true,
            where: { sessionId },
          },
        ],
      },
    ];
  },
  getAllByUsers: (userIds: string[]) => {
    return [
      {
        model: SessionParticipant,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: Session,
            attributes: ['id'],
            include: [
              {
                model: Club,
                attributes: ['id'],
                include: [
                  {
                    model: User,
                    attributes: ['id'],
                    as: UserRole.staff,
                    where: { id: userIds },
                    through: { attributes: [] },
                  },
                  {
                    model: User,
                    attributes: ['id'],
                    as: UserRole.student,
                    where: { id: userIds },
                    through: { attributes: [] },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  getAllBySchedule: (scheduleId: string) => {
    return [
      {
        model: SessionInstance,
        attributes: ['id'],
        required: true,
        where: { sessionScheduleId: scheduleId },
      },
    ];
  },
};
