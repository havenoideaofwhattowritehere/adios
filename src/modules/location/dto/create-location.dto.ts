import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  maxPeople: number;

  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;

  @ApiProperty()
  @IsString()
  gMapName: string;
}
