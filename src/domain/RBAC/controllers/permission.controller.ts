import { CustomController } from 'src/common/decorators/controller.decorator';
import ResourceController from 'src/common/resources/resource-controller';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../schema/permission.schema';
import { ROLES } from 'src/common/enums/roles.enum';

@CustomController({
  apiTag: 'RBAC',
  auth: true,
  roles: [ROLES.GOD_ADMIN],
  path: 'permission',
})
export class PermissionController extends ResourceController({
  schema: Permission,
  service: PermissionService,
  options: {
    omitRoutes: ['remove'],
  },
}) {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }
}
