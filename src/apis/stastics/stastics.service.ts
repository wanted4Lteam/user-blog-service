import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StasticsService {
  constructor(
    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.userrepository.findAndCount();
  }

  async findByGender(gender: string) {
    const result = await this.userrepository.findAndCountBy({ gender: gender });
    return result[1];
  }

  async findByAge(age: number) {
    const result = await this.userrepository.findAndCountBy({
      age: Between(age, age - 0 + 9),
    });
    return result[1];
  }

  async findByConnected(hour: number) {
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const last_date = new Date(
      year,
      month,
      day,
      hours - hour,
      minutes,
      seconds,
    );

    const result = await this.userrepository.findAndCountBy({
      lastconnect_date: MoreThan(last_date),
    });
    return result[1];
  }
}
