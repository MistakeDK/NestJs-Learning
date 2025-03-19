import { SetMetadata } from '@nestjs/common';

export const IS_SAME_USER = 'isSameUser';
export const IsSameUser = () => SetMetadata(IS_SAME_USER, true);
