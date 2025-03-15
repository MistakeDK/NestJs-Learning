import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

export interface IQuerryPage {
  page: number;
  limit: number;
  [key: string]: unknown;
}

@Injectable()
export class QuerryPagePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let { page, limit } = value;
    page = page !== undefined ? parseInt(page, 10) : 1;
    limit = limit !== undefined ? parseInt(limit, 10) : 10;
    if (isNaN(page) || page < 1) {
      throw new BadRequestException(
        'Query parameter "page" must be a number and at least 1.',
      );
    }
    if (isNaN(limit) || limit < 1) {
      throw new BadRequestException(
        'Query parameter "limit" must be a number and at least 1.',
      );
    }
    return { page, limit };
  }
}
