import { User } from '../../user/entities/user.entity';

export class GetUserByPhoneDto {
  isExist: boolean;
  isInClub: boolean;
  user?: User;
}
