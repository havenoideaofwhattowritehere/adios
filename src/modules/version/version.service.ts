import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VersionService {
  getVersion(): string {
    try {
      const versionFilePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'version.txt',
      );
      const version = fs.readFileSync(versionFilePath, 'utf8').trim();
      return version;
    } catch (error) {
      return 'unknown';
    }
  }
}
