import * as dayjs from 'dayjs';
import * as timezone from 'timezone';
import { I18nContext } from 'nestjs-i18n';
import { BadRequestException } from '@nestjs/common';

import { DateFormat, lang, tz } from './date.format';
import { ErrorMap } from '../response/error.map';

export class DateUtil {
  async formatDate(
    date: Date,
    userTimezone: string,
    format: DateFormat,
  ): Promise<string> {
    return dayjs(timezone(date, '%c', userTimezone))
      .locale(I18nContext.current().lang)
      .format(format);
  }

  async formatConstDate(date: Date): Promise<string> {
    return dayjs(timezone(date, '%c', tz))
      .locale(lang)

      .format(DateFormat.RFC1123_DATE);
  }

  async combineDateAndTime(
    currentDate: Date | string,
    time: string,
  ): Promise<Date> {
    if (typeof currentDate === 'string') {
      currentDate = new Date(currentDate);
    }

    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
      throw new BadRequestException(ErrorMap.INVALID_DATE);
    }

    const [hour, minute, seconds] = time.split(':').map(Number);

    const resultDate = new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hour,
        minute,
        seconds || 0,
      ),
    );
    return resultDate;
  }
}
