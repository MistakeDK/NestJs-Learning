import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isDate, isNumber } from 'class-validator';

export interface IQuerryCursor {
  cursor: string | null;
  limit: number;
  [key: string]: unknown;
}

@Injectable()
export class QuerryCursorPipe implements PipeTransform {
  transform(value: IQuerryCursor, metadata: ArgumentMetadata) {
    let { cursor, limit } = value;
    if (cursor) {
      const parsed = new Date(cursor);
      cursor =
        isDate(parsed) && !isNaN(parsed.getTime())
          ? parsed.toISOString()
          : null;
    }
    if (isNaN(limit)) {
      throw new BadRequestException('Limit must be number');
    }
    return { cursor, limit };
  }
}
