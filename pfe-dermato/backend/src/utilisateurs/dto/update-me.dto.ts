import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const trimValue = ({ value }: { value: any }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export class UpdateMeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(trimValue)
  nom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(trimValue)
  prenom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(trimValue)
  nomComplet?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s-]{8,20}$/, {
    message: 'Numéro de téléphone invalide',
  })
  @Transform(trimValue)
  telephone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  @ApiPropertyOptional({ enum: ['homme', 'femme', 'autre'] })
  @IsOptional()
  @IsIn(['homme', 'femme', 'autre'])
  sexe?: 'homme' | 'femme' | 'autre';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimValue)
  allergies?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimValue)
  antecedents?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimValue)
  traitements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trimValue)
  dureeLesion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimValue)
  symptomes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trimValue)
  zoneCorps?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(trimValue)
  observation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  doubleAuthActive?: boolean;
}