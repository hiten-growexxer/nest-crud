import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class userListResponseDto {
  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  password: string;

  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  first_name: string;

  @Expose()
  @ApiProperty()
  last_name: string;

  @Expose()
  @ApiProperty()
  is_active: string;

  @Expose()
  @ApiProperty()
  role: string;
}
