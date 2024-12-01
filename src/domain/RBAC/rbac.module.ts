import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controllers';
import { PermissionController } from './controllers/permission.controller';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../../common/modules/api/api.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [],
  controllers: [RoleController, PermissionController],
  providers: [
    RoleService,
    PermissionService,
    AuthService,
    ApiService,
    UserService,
  ],
})
export class rbacModule {}
