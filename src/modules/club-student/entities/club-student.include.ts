import { Op } from 'sequelize';

import { User } from '../../../modules/user/entities/user.entity';
import { SearchClubStudentsDto } from '../dto/search-club-student.dto';

export const CLUB_STUDENT_INCLUDE = {
  create: () => {
    return [{ model: User }];
  },
  getOne: () => {
    return [{ model: User }];
  },
  getAll: () => {
    return [{ model: User }];
  },
  getAllWithQuery: (payload: SearchClubStudentsDto) => {
    return (
      payload?.name && [
        {
          model: User,
          where: {
            [Op.or as symbol]: [
              { firstName: { [Op.like as symbol]: `%${payload.name}%` } },
              { lastName: { [Op.like as symbol]: `%${payload.name}%` } },
              payload.name.split(' ').length === 2 && {
                [Op.and as symbol]: [
                  {
                    firstName: {
                      [Op.like as symbol]: `%${payload.name.split(' ')[0]}%`,
                    },
                  },
                  {
                    lastName: {
                      [Op.like as symbol]: `%${payload.name.split(' ')[1]}%`,
                    },
                  },
                ],
              },
            ],
          },
        },
      ]
    );
  },
};
