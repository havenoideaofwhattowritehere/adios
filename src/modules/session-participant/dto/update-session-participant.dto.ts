import { PartialType } from '@nestjs/swagger';

import { CreateSessionParticipantDto } from './create-session-participant.dto';

export class UpdateSessionParticipantDto extends PartialType(
  CreateSessionParticipantDto,
) {}
