import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { ROLES } from 'src/common/enums/roles.enum';
import { randomCodeGenerator } from 'src/common/functions/random-code-generator';
import { ApiService } from '../../common/modules/api/api.service';
import { createSMSParams } from 'src/common/utils/sms.util';
import { UserService } from '../user/user.service';
import JWTPayLoad from 'src/common/interfaces/jwt.interface';
import { DeviceSession } from '../user/schemas/device-session.schema';
import { hashSync, compareSync } from 'bcrypt';
import { CheckOtpDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, password, confirmPassword } = registerDto;
    const dbHasUser = await this.userModel.find({});
    let roleName = ROLES.CLIENT;
    if (!dbHasUser || dbHasUser.length <= 0) roleName = ROLES.GOD_ADMIN;
    if (password !== confirmPassword)
      throw new BadRequestException(
        'Password Does not Match with confirm password.',
      );
    const deviceSession: DeviceSession = {
      password: this.hashPassword(password),
      confirmPassword: this.hashPassword(confirmPassword),
    };
    return await this.userModel.create({
      ...registerDto,
      fullName: `${firstName} ${lastName}`,
      role: roleName,
      deviceSessions: deviceSession,
    });
  }

  async forgotPassword(user: UserDocument) {
    const code: string = randomCodeGenerator(5).toString();
    const now = Date.now();
    const expires_in = now + 60000; // (60000) for 1 minute
    if (
      user?.deviceSessions?.otp_code &&
      user?.deviceSessions?.otp_expires_in
    ) {
      if (+user?.deviceSessions?.otp_expires_in > now)
        throw new BadRequestException('Otp has not yet expired');
    }
    user.deviceSessions.otp_code = code;
    user.deviceSessions.otp_expires_in = expires_in;
    await user.save();
    if (process.env.NODE_ENV === 'production') {
      await this.sendOtpCode(user.mobile, code);
      return {
        statusCode: HttpStatus.OK,
        message: 'Otp Code Sended!',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Otp Code Sended!',
      code,
    };
  }

  async loginWithPassword(
    user: UserDocument,
    password: string,
    userAgent: string,
  ) {
    if (!compareSync(password, user.deviceSessions.password))
      throw new BadRequestException('National Code Or Password Is Incorrect');
    this.setUserTokens(user, userAgent);
    user.lastLogin = new Date();
    await user.save();
    return {
      fullName: user.fullName,
      mobile: user.mobile,
      role: user.role,
      access_token: user.deviceSessions.access_token,
      refresh_token: user.deviceSessions.refresh_token,
    };
  }

  async checkOtp(
    user: UserDocument,
    checkOtpDto: CheckOtpDto,
    userAgent: string,
  ) {
    if (user?.deviceSessions?.otp_code !== checkOtpDto.otp_code)
      throw new BadRequestException('Code does not match');
    if (user?.deviceSessions?.otp_expires_in <= Date.now())
      throw new BadRequestException('Otp Expired');
    if (checkOtpDto.password !== checkOtpDto.confirmPassword)
      throw new BadRequestException(
        'Password does not match with confirm password',
      );
    this.setUserTokens(user, userAgent);
    user.lastLogin = new Date();
    user.deviceSessions.password = this.hashPassword(checkOtpDto.password);
    user.deviceSessions.confirmPassword = this.hashPassword(
      checkOtpDto.confirmPassword,
    );
    await user.save();
    return {
      fullName: user.fullName,
      mobile: user.mobile,
      role: user.role,
      access_token: user.deviceSessions.access_token,
      refresh_token: user.deviceSessions.refresh_token,
    };
  }

  async validateJwtPayload(payload: JWTPayLoad): Promise<any> {
    const user = await this.userService.findOne({
      _id: payload.id,
      mobile: payload.mobile,
    });
    if (user) return user;
    throw new UnauthorizedException('User not found');
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Jwt Expire');
    }
  }

  async logout(user: UserDocument) {
    const existUser = await this.userService.findOne({ _id: user?._id });
    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    user.deviceSessions.access_token = null;
    user.deviceSessions.refresh_token = null;
    await user.save();
    return true;
  }

  private async sendOtpCode(mobile: string, code: string) {
    const { MELIPAYAMAK_USERNAME, MELIPAYAMAK_PASSWORD, MELIPAYAMAK_BODY_ID } =
      process.env;
    const parameters = createSMSParams(
      MELIPAYAMAK_USERNAME,
      MELIPAYAMAK_PASSWORD,
      mobile,
      code,
      +MELIPAYAMAK_BODY_ID,
    );
    await this.apiService.meliPayamakSendVerifySms(parameters);
  }

  private setUserTokens(user: UserDocument, userAgent: string) {
    user.deviceSessions.user_agents.push(userAgent);
    user.deviceSessions.access_token = this.signAccessToken({
      id: user.id,
      mobile: user.mobile,
    });
    user.deviceSessions.refresh_token = this.signRefreshToken({
      id: user.id,
      mobile: user.mobile,
    });
    return user;
  }

  private signAccessToken(payload: JWTPayLoad) {
    return this.jwtService.sign(payload, {
      expiresIn: '60d',
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  private signRefreshToken(payload: JWTPayLoad) {
    return this.jwtService.sign(payload, {
      expiresIn: '1y',
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, 12);
  }
}
