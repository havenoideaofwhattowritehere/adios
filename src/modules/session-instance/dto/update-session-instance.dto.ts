import { PartialType } from '@nestjs/swagger';
import { CreateSessionInstanceDto } from './create-session-instance.dto';

export class UpdateSessionInstanceDto extends PartialType(
  CreateSessionInstanceDto,
) {}
