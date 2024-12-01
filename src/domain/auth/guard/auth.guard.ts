import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as pAuth } from '@nestjs/passport';
import CustomFastifyRequest from 'src/common/interfaces/fastify.interface';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { UserService } from 'src/domain/user/user.service';
import JWTPayLoad from 'src/common/interfaces/jwt.interface';
@Injectable()
export class AuthGuard extends pAuth('jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuth = this.reflector.get(NoAuth, context.getHandler());

    if (noAuth !== undefined) return true;

    const request: CustomFastifyRequest = context.switchToHttp().getRequest();

    const token: string = request.headers.authorization;

    const isBearer = token ? token.split(' ')[0] : '';

    if (!token || token?.trim() === '' || isBearer !== 'Bearer') {
      return await this.validateCookieToken(request);
    }

    return await this.validateHeaderToken(request, token);
  }

  private async validateCookieToken(request: CustomFastifyRequest) {
    const accessCookieToken = request.cookies['access-token'];
    if (!accessCookieToken) throw new UnauthorizedException('Token Not Found');
    const verifiedAccessToken =
      await this.authService.verifyToken(accessCookieToken);
    const user = await this.validateUserExistence(verifiedAccessToken);
    request.user = user;
    return true;
  }

  private async validateHeaderToken(
    request: CustomFastifyRequest,
    token: string,
  ) {
    const accessToken = token.split(' ')[1];
    request.headers['token'] = accessToken;
    const verifiedToken = await this.authService.verifyToken(accessToken);
    const user = await this.validateUserExistence(verifiedToken);
    request.user = user;
    return true;
  }

  private async validateUserExistence(verifiedAccessToken: JWTPayLoad) {
    const user = await this.userService.findOne({
      mobile: verifiedAccessToken.mobile,
    });
    if (!user) throw new UnauthorizedException('Token Not Found');
    return user;
  }
}
