import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class KeysDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  p256dh: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  auth: string;
}

export class CreatePushNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  endpoint: string;

  @ApiProperty({ type: () => KeysDto })
  @Type(() => KeysDto)
  @IsNotEmpty()
  keys: KeysDto;
}

export class MessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class KeyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;
}

export type WebPushResult = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};
