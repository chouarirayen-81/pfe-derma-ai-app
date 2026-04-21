import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResetPasswordDto {
  @ApiProperty({ example: 'rayen@gmail.com' })
  @IsString()
  @IsEmail()
  @Transform(({ value }) => String(value || '').trim().toLowerCase())
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'Le code doit contenir exactement 6 chiffres',
  })
  code!: string;

  @ApiProperty({ example: 'NouveauMdp2026!' })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre',
  })
  nouveauMotDePasse!: string;
}