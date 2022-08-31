import { ApiProperty } from '@nestjs/swagger';

export class UserInput {
  @ApiProperty({
    type: String,
    description: 'email',
    default: '',
  })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'password',
    default: '',
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    description: 'name',
    default: '',
  })
  readonly name: string;

  @ApiProperty({
    type: String,
    description: 'gender',
    default: '',
  })
  readonly gender: string;

  @ApiProperty({
    type: String,
    description: 'phone',
    default: '',
  })
  readonly phone: string;

  @ApiProperty({
    type: Number,
    description: 'age',
    default: '',
  })
  readonly age: number;
}
