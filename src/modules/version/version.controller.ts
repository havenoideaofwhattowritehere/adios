import { Controller, Get, Res } from '@nestjs/common';
import { VersionService } from './version.service';
import { Response } from 'express';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  getVersion(@Res() res: Response): void {
    const version = this.versionService.getVersion();
    res.set('Content-Type', 'text/plain');
    res.send(version);
  }
}
