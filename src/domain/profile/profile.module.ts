import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiService } from 'src/common/modules/api/api.service';
import { UserService } from '../user/user.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [AuthService, ApiService, UserService],
})
export class ProfileModule {}
