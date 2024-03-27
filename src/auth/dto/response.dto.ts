import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class signInResponseDto {
  @Expose()
  @ApiProperty()
  @IsEmail()
  email: string;

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

  @Expose()
  @ApiProperty()
  token: string;
}

export class signupResponseDto {
  @Expose()
  @ApiProperty()
  @IsEmail()
  email: string;

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

  @Expose()
  @ApiProperty()
  token: string;

  @Expose()
  @ApiProperty()
  otp: string;
}

export class verifyAccountResponseDto {
  @Expose()
  @ApiProperty()
  token: string;
}

export class resetPasswordResponseDto {
  @Expose()
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class forgotPasswordResponseDto {
  @Expose()
  @ApiProperty()
  resetLink: string;
}
export default class response<Type> {
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  success: boolean;

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  data: Type;
}
