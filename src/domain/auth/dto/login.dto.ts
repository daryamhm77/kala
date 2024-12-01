import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/domain/user/schemas/user.schema';

export class LoginDto extends PickType(User, ['mobile']) {}
export class LoginWithPasswordDto extends PickType(User, ['nationalCode']) {
  @ApiProperty()
  password: string;
}

export class CheckOtpDto extends PickType(User, ['mobile'] as const) {
  @ApiProperty()
  otp_code: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;
}
