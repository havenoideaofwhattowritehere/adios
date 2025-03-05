import { User } from '../../user/entities/user.entity';
import { Club } from '../../club/entities/club.entity';
import { Session } from '../../session/entities/session.entity';
import { UserRole } from '../../../shared/helpers/roles.enum';

export const SESSION_PARTICIPANT_INCLUDE = {
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
        model: Session,
        where: { clubId },
      },
    ];
  },
  getAllByUsers: (userIds: string[]) => {
    return [
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
    ];
  },
};
