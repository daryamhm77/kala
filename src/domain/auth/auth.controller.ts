import { CustomController } from 'src/common/decorators/controller.decorator';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import {
  BadRequestException,
  Body,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CheckOtpDto, LoginDto, LoginWithPasswordDto } from './dto/login.dto';
import { FastifyReply } from 'fastify';
import { CookieOptions } from 'src/common/constants/cookie-options.constant';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';
import { AuthGuard } from './guard/auth.guard';

@CustomController({
  path: 'auth',
  apiTag: 'Authorization',
  auth: false,
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.findOne({
      mobile: registerDto.mobile,
    });
    if (!user) {
      const result = await this.authService.register(registerDto);
      return result;
    } else throw new BadRequestException('user with this phone number exist');
  }

  @Post('forgot-password')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findOne({
      mobile: loginDto.mobile,
    });
    if (!user)
      throw new NotFoundException(`User Not Found With ${loginDto.mobile}`);
    const result = await this.authService.forgotPassword(user);
    return result;
  }

  @Post('login-with-password')
  async loginWithPassword(
    @Body() loginWithPasswordDto: LoginWithPasswordDto,
    @Res({ passthrough: false }) res: FastifyReply,
    @Req() req: CustomFastifyRequest,
  ) {
    const userAgent = req.headers['user-agent'];
    console.log(loginWithPasswordDto);
    const user = await this.userService.findOne({
      nationalCode: loginWithPasswordDto.nationalCode,
    });
    if (!user)
      throw new NotFoundException(
        `User Not Found With ${loginWithPasswordDto.nationalCode}`,
      );
    const result = await this.authService.loginWithPassword(
      user,
      loginWithPasswordDto.password,
      userAgent,
    );
    res.setCookie('access-token', result.access_token, CookieOptions);
    res.setCookie('refresh-token', result.refresh_token, CookieOptions);
    res.send(result);
  }

  @Post('check-otp')
  async checkOtp(
    @Body() checkOtpDto: CheckOtpDto,
    @Res({ passthrough: false }) res: FastifyReply,
    @Req() req: CustomFastifyRequest,
  ) {
    const userAgent = req.headers['user-agent'];

    const user = await this.userService.findOne({
      mobile: checkOtpDto.mobile,
    });
    if (!user)
      throw new NotFoundException(`User Not Found With ${checkOtpDto.mobile}`);
    const result = await this.authService.checkOtp(
      user,
      checkOtpDto,
      userAgent,
    );
    res.setCookie('access-token', result.access_token, CookieOptions);
    res.setCookie('refresh-token', result.refresh_token, CookieOptions);
    res.send(result);
  }

  @Put('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: CustomFastifyRequest, @Res() res: FastifyReply) {
    await this.authService.logout(req.user);
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    res.send({
      success: true,
      message: 'Logged out successfully.',
    });
  }
}
