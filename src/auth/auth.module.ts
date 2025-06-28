import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, // Makes the JWT module available globally
      secret: process.env.JWT_SECRET,
      // change to 60s
      signOptions: { expiresIn: '300s' }, // Token expiration time, 5 minutes
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
