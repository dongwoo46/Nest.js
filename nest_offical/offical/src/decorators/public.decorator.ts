import { SetMetadata } from '@nestjs/common';

// @Public을 이용하면 authguard 인증을 건너뛸 수 있음
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
