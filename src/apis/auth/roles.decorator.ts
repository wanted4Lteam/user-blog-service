import { SetMetadata } from '@nestjs/common';

export const Rules = (...roles: string[]) => SetMetadata('roles', roles);