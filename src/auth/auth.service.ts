import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JWTPayload } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async issueJWT({ userId }: { userId: string }) {
    const payload: JWTPayload = {
      userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
    ]);

    await this.userService.updateUser({
      data: { refreshToken },
      where: { id: userId },
    });

    return { accessToken, refreshToken };
  }

  async refreshJWT({
    refreshToken,
    userId,
  }: {
    refreshToken: string;
    userId: string;
  }) {
    const user = await this.userService.findUser({ id: userId, refreshToken });

    if (!user) throw new NotFoundException();

    return this.issueJWT({ userId });
  }

  async signIn({ email, password }: { email: string; password: string }) {
    const user = await this.userService.findUser({ email });
    if (!user) {
      // TODO, move messages to constants
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    // console.log()

    return this.issueJWT({ userId: user.id });
  }

  async signUp({ email, password }: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
    });
    return this.issueJWT({ userId: user.id });
  }

  decodeJWT(jwt: string) {
    const decoded: JWTPayload = this.jwtService.decode(jwt);
    return decoded;
  }
}
