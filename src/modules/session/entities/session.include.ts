import { Op } from 'sequelize';

import { Location } from '../../../modules/location/entities/location.entity';
import { SearchSessionsDto } from '../dto/search-session.dto';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../../shared/helpers/roles.enum';
import { Club } from '../../club/entities/club.entity';

export const SESSION_INCLUDE = {
  create: () => {
    return [];
  },
  getOne: () => {
    return [];
  },
  getAll: () => {
    return [];
  },
  getAllByUsers: (userIds: string[], role: UserRole) => {
    return [
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
    ];
  },
  getAllWithQuery: (payload: SearchSessionsDto) => {
    return (
      payload?.location && [
        {
          model: Location,
          where: { name: { [Op.like as symbol]: `%${payload.location}%` } },
        },
      ]
    );
  },
};
