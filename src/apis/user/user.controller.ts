import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserInput } from './dto/user.input';
import { UserService } from './user.service';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() input: UserInput) {
    return await this.userService.create({ input });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete({ id });
  }
}
