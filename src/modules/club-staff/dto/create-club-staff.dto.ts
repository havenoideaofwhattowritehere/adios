import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { StaffStatus } from '../entities/club-staff.entity';
import { UUID } from '../../../shared/common/interfaces/types';

export class CreateClubStaffDto {
  @ApiProperty()
  @IsUUID()
  clubId: UUID;

  @ApiProperty()
  @IsUUID()
  userId: UUID;

  @ApiProperty({ enum: StaffStatus })
  @IsEnum(StaffStatus, { message: 'Valid role required' })
  status: StaffStatus;
}
