import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BUCKET } from './constants';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilesService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}
  private s3Client: S3Client;

  onModuleInit() {
    this.s3Client = new S3Client({
      region: 'weur',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
      },
    });
  }

  async generateUploadUrl({
    fileName,
    userId,
  }: {
    fileName: string;
    userId: string;
  }) {
    const Key = `${userId}/${randomUUID()}/${fileName}`;
    const putCommand = new PutObjectCommand({
      Key,
      Bucket: BUCKET,
    });

    const signedUrl = await getSignedUrl(this.s3Client, putCommand);

    return { signedUrl, Key };
  }

  async createFile(
    data: Omit<
      Prisma.FileUncheckedCreateInput,
      'id' | 'createdAt' | 'updatedAt'
    >,
  ) {
    const file = await this.prismaService.file.create({
      data,
    });
    return file;
  }

  async getFiles(where: Prisma.FileWhereInput) {
    return this.prismaService.file.findMany({ where });
  }
}
