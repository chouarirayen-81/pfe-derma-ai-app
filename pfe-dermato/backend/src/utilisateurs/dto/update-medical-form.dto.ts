import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMedicalFormDto {
  @IsOptional()
  @IsString()
  nomComplet?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  age?: number;

  @IsOptional()
  @IsString()
  sexe?: string;

  @IsOptional()
  @IsString()
  antecedents?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  traitements?: string;

  @IsOptional()
  @IsString()
  dureeLesion?: string;

  @IsOptional()
  @IsString()
  symptomes?: string;

  @IsOptional()
  @IsString()
  zoneCorps?: string;

  @IsOptional()
  @IsString()
  observation?: string;
}