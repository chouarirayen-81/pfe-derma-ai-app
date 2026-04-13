import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordWithCodeDto {
  @ApiProperty({
    example: 'MonAncienMotDePasse123',
  })
  @IsString()
  @MinLength(6)
  ancienMotDePasse!: string;

  @ApiProperty({
    example: 'NouveauMdp2026!',
  })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre',
  })
  nouveauMotDePasse!: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'Le code de vérification doit contenir exactement 6 chiffres',
  })
  codeVerification!: string;
}