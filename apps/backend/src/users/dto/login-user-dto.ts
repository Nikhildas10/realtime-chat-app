import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class loginUserDto {
  @ValidateIf((o) => !o.username)
  @IsEmail({}, { message: 'email is required' })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
