import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // Exporting UsersService to make it available in other modules
})
export class UsersModule {}
