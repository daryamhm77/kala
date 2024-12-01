import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { MinioModule } from 'src/common/modules/minio/minio.module';
import { ApiService } from 'src/common/modules/api/api.service';

@Module({
  imports: [MinioModule],
  controllers: [FilesController],
  providers: [AuthService, ApiService, UserService],
})
export class FilesModule {}
