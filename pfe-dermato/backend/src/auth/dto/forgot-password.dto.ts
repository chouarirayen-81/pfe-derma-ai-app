import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'rayen@gmail.com' })
  @IsString()
  @IsEmail()
  @Transform(({ value }) => String(value || '').trim().toLowerCase())
  email!: string;
}