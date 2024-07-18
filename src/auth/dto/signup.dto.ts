import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'username of user',
    example: 'fadi_b13',
  })
  username: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'firstName of user',
    example: 'fadi',
  })
  firstname: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'lastName of user',
    example: 'romdhan',
  })
  lastname: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'email of user',
    example: 'fadiromdh@gmail.com',
  })
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password must be length > 6' })
  @ApiProperty({
    description: 'password must be > 6',
    example: 'fadifadi123',
  })
  password: string;
}
