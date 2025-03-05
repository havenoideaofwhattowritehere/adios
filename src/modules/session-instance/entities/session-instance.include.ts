import { Session } from '../../session/entities/session.entity';
import { Location } from '../../location/entities/location.entity';
import { SessionSchedule } from '../../session-schedule/entities/session-schedule.entity';
import { SessionParticipant } from '../../session-participant/entities/session-participant.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { ClubStudent } from '../../club-student/entities/club-student.entity';
import { User } from '../../user/entities/user.entity';
import { Club } from '../../club/entities/club.entity';
import { UserRole } from '../../../shared/helpers/roles.enum';

export const SESSION_INSTANCE_INCLUDE = {
  create: () => {
    return [];
  },
  getOne: () => {
    return [];
  },
  getAllAfterCreate: () => {
    return [
      {
        model: SessionSchedule,
        as: 'sessionSchedule',
        include: [
          {
            model: Session,
            as: 'session',
            include: [{ model: SessionParticipant, as: 'sessionParticipants' }],
          },
        ],
      },
    ];
  },
  getAll: (clubId: string) => {
    return [
      {
        model: SessionSchedule,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: Session,
            attributes: ['name'],
            where: { clubId },
            required: true,
            include: [{ model: Location, required: false }],
          },
        ],
      },
      {
        model: Attendance,
        as: 'attendances',
        attributes: ['id', 'attended'],
        include: [
          {
            model: SessionParticipant,
            as: 'sessionParticipant',
            attributes: ['id'],
            include: [
              {
                model: ClubStudent,
                as: 'clubStudent',
                attributes: ['id'],
                include: [
                  { model: User, attributes: ['firstName', 'lastName'] },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  getAllBySession: (sessionId: string) => {
    return [
      {
        model: SessionSchedule,
        attributes: ['id'],
        required: true,
        where: { sessionId },
      },
    ];
  },
  getAllByUsers: (userIds: string[], role: UserRole) => {
    return [
      {
        model: SessionSchedule,
        attributes: ['id'],
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
                    as: role,
                    attributes: ['id'],
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
};
