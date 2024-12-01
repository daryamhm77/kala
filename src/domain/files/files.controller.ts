import { Body, Get, Param, Post, Res, UseInterceptors } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import * as contentDisposition from 'content-disposition';
import { ApiConsumes } from '@nestjs/swagger';
import { CustomController } from 'src/common/decorators/controller.decorator';
import FileDto from './dto/file.dto';
import { MINIOInterceptor } from 'src/common/modules/minio/interceptors/minio.interceptor';
import { MinioService } from 'src/common/modules/minio/minio.service';

@CustomController({
  path: 'files',
  apiTag: 'Files',
})
export class FilesController {
  constructor(private readonly minioService: MinioService) {}
  @Get('/:file')
  async findAll(@Param('file') fileName: string, @Res() res: FastifyReply) {
    try {
      const files = await this.minioService.getFile({ fileName });
      res.header(
        'Content-Disposition',
        contentDisposition(fileName, { type: 'attachment' }),
      );
      res.header('access-control-expose-headers', 'Content-Disposition');
      res.send(files);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MINIOInterceptor())
  addEducation(@Body() body: FileDto) {
    return { file: body.file };
  }
}
