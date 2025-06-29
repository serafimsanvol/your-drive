import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JWTPayload } from 'src/auth/constants';
import { Prisma } from '@prisma/client';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-url')
  @UseGuards(AuthGuard)
  async uploadUrl(
    @Body() body: { fileName: string },
    @Request() req: { user: JWTPayload },
  ) {
    const { Key, signedUrl } = await this.filesService.generateUploadUrl({
      userId: req.user.userId,
      fileName: body.fileName,
    });

    return { signedUrl, Key };
  }

  @Post('upload-success')
  @UseGuards(AuthGuard)
  async createDbFile(
    @Body() data: Omit<Prisma.FileUncheckedCreateInput, 'userId'>,
    @Request() req: { user: JWTPayload },
  ) {
    const result = await this.filesService.createFile({
      ...data,
      userId: req.user.userId,
    });
    return result;
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getFiles(@Request() req: { user: JWTPayload }) {
    return this.filesService.getFiles({ userId: req.user.userId });
  }
}
