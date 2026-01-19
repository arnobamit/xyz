import { IsOptional, IsString, MinLength, IsInt } from 'class-validator';

export class CreateSupervisorDto {
  @IsString()
  s_username: string;

  @IsString()
  @MinLength(6)
  s_password: string;

  @IsString()
  s_fullname: string;

  @IsOptional()
  @IsString()
  s_phone?: string;

  @IsOptional()
  @IsString()
  s_email?: string;

  @IsOptional()
  @IsString()
  s_gender?: string;

  @IsInt()
  adminId: number;
}

export class UpdateSupervisorDto {
  @IsOptional()
  @IsString()
  s_fullname?: string;

  @IsOptional()
  @IsString()
  s_phone?: string;

  @IsOptional()
  @IsString()
  s_email?: string;

  @IsOptional()
  @IsString()
  s_gender?: string;
}

export class LoginSupervisorDto {
  @IsString()
  s_username: string;

  @IsString()
  s_password: string;
}
