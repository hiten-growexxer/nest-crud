import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class resetPasswordDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
