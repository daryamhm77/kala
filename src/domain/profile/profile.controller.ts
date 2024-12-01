import { CustomController } from 'src/common/decorators/controller.decorator';
import { ROLES } from 'src/common/enums/roles.enum';
import { UserService } from '../user/user.service';
import { Get, Req } from '@nestjs/common';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';

@CustomController({
  apiTag: 'Profile',
  path: 'profile',
  auth: true,
  roles: [ROLES.CLIENT],
})
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async profile(@Req() req: CustomFastifyRequest) {
    return await this.userService.profile({
      mobile: req.user.mobile,
    });
  }
}
