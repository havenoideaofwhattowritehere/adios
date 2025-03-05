import { Club } from '../../club/entities/club.entity';
import { UserRole } from '../../../shared/helpers/roles.enum';
import { Session } from '../../session/entities/session.entity';
import { User } from '../../user/entities/user.entity';

export const SESSION_SCHEDULE_INCLUDE = {
  create: () => {
    return [{ model: Session }];
  },
  getOne: () => {
    return [{ model: Session }];
  },
  getAll: () => {
    return [{ model: Session }];
  },
  getAllByClub: (clubId: string) => {
    return [
      {
        model: Session,
        where: { clubId },
      },
    ];
  },
  getAllByUsers: (userIds: string[], role: UserRole) => {
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
                as: role,
                attributes: ['id'],
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
