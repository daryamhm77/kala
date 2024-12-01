import { ApiProperty } from '@nestjs/swagger';

export default class FileDto {
  @ApiProperty({
    type: String,
    format: 'binary',
  })
  file: string;
}
