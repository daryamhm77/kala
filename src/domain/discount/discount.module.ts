import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { AuthService } from '../auth/auth.service';
import { ApiService } from 'src/common/modules/api/api.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [],
  controllers: [DiscountController],
  providers: [DiscountService, AuthService, ApiService, UserService],
})
export class DiscountModule {}
