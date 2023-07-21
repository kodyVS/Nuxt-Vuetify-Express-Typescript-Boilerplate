import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  public password: string;
  @IsNotEmpty()
  public firstName: string;
  @IsNotEmpty()
  public lastName: string;

  @IsIn(['user', 'admin'])
  public userRole: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsNotEmpty()
  public firstName: string;
  @IsNotEmpty()
  public lastName: string;

  @IsIn(['user', 'admin'])
  public userRole: string;
}
export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
  @IsNotEmpty()
  public password: string;
}
