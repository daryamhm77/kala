import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/domain/user/schemas/user.schema';

export class RegisterDto extends PickType(User, [
  'firstName',
  'lastName',
  'mobile',
  'gender',
  'nationalCode',
  'postalCode',
  'companyName',
  'birthday',
  'personnelCode',
  'address',
  'province',
  'city',
] as const) {
  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;
}
