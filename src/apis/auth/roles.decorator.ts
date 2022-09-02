import { SetMetadata } from "@nestjs/common";
import { Grade } from "../user/entities/user.entity";

export const Rules = (...roles: string[]) => SetMetadata('roles', roles);