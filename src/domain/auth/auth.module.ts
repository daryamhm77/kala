import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ApiService } from '../../common/modules/api/api.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, ApiService],
  exports: [JwtModule],
})
export class AuthModule {}
