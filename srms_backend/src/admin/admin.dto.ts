import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  a_username: string;

  @IsString()
  @MinLength(6)
  a_password: string;

  @IsString()
  a_fullname: string;

  @IsOptional()
  @IsString()
  a_phone?: string;

  @IsOptional()
  @IsEmail()
  a_email?: string;

  @IsOptional()
  @IsString()
  a_gender?: string;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  a_fullname?: string;

  @IsOptional()
  @IsString()
  a_phone?: string;

  @IsOptional()
  @IsEmail()
  a_email?: string;

  @IsOptional()
  @IsString()
  a_gender?: string;
}

export class LoginAdminDto {
  @IsString()
  a_username: string;

  @IsString()
  a_password: string;
}
