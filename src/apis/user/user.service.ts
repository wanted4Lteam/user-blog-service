import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async create({ input }) {
    return await this.userrepository.save(input);
  }

  async delete({ id }) {
    return await this.userrepository.softDelete({ id });
  }

  async findOne(email: string) {
    return this.userrepository.findOneBy({ email: email });
  }

  async update(id: string) {
    const date = new Date();

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    const connect_date =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds;

    const user_connected = {
      lastconnect_date: connect_date,
    };
    return await this.userrepository.update(id, user_connected);
  }
}
