import { Club } from '../../club/entities/club.entity';

export const USER_INCLUDE = {
  create: () => {
    return [
      { model: Club, as: 'clubsAsStaff', through: { attributes: [] } },
      { model: Club, as: 'clubsAsStudent', through: { attributes: [] } },
    ];
  },
  getOne: () => {
    return [
      { model: Club, as: 'clubsAsStaff', through: { attributes: [] } },
      { model: Club, as: 'clubsAsStudent', through: { attributes: [] } },
    ];
  },
  getAll: () => {
    return [
      { model: Club, as: 'clubsAsStaff', through: { attributes: [] } },
      { model: Club, as: 'clubsAsStudent', through: { attributes: [] } },
    ];
  },
};
