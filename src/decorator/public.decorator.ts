import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublicKey';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
