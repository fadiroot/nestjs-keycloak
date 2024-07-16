import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'username of the user',
    example: 'fadi',
  })
  user: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'username of the user',
    example: 'fadi',
  })
  password: string;
}
