import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  e_username: string;

  @IsString()
  @MinLength(6)
  e_password: string;

  @IsString()
  e_fullname: string;

  @IsOptional()
  @IsString()
  e_phone?: string;

  @IsOptional()
  @IsString()
  e_email?: string;

  @IsOptional()
  @IsString()
  e_gender?: string;

  @IsInt()
  supervisorId: number;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  e_fullname?: string;

  @IsOptional()
  @IsString()
  e_phone?: string;

  @IsOptional()
  @IsString()
  e_email?: string;

  @IsOptional()
  @IsString()
  e_gender?: string;
}

export class LoginEmployeeDto {
  @IsString()
  e_username: string;

  @IsString()
  e_password: string;
}
