import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SendVerificationCodeDto {
  @ApiProperty({
    example: 'MonAncienMotDePasse123',
  })
  @IsString()
  @MinLength(6)
  ancienMotDePasse!: string;
}