import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JWTPayload } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body);
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    return this.authService.signUp(body);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: JWTPayload }) {
    // The user information is attached to the request by the AuthGuard
    return { user: req.user };
  }

  @UseGuards(AuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body() body: { refreshToken: string },
    @Request() req: { user: JWTPayload },
  ) {
    return this.authService.refreshJWT({
      refreshToken: body.refreshToken,
      userId: req.user.userId,
    });
  }
}
