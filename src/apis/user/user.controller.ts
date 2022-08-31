import { Body, Controller, Post } from '@nestjs/common';
import { UserInput } from './dto/user.input';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() input: UserInput) {
    return await this.userService.create(input);
  }
}
