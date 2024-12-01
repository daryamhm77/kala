import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { CustomControllerOptions } from '../interfaces/controller.interface';
import { AuthGuard } from 'src/domain/auth/guard/auth.guard';
import { Roles } from './role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/domain/auth/guard/role.guard';

export const CustomController = ({
  path,
  apiTag = path,
  auth = true,
  roles,
}: CustomControllerOptions) => {
  const decorators = [];
  auth && decorators.push(UseGuards(AuthGuard));
  roles && decorators.push(Roles(...roles));
  roles && decorators.push(UseGuards(RoleGuard));
  decorators.push(
    ApiTags(apiTag as string),
    Controller({ path }),
    ApiBearerAuth('access-token'),
  );
  return applyDecorators(...decorators);
};
