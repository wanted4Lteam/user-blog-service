import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, Repository } from 'typeorm';
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

  async findByConnected(hour: number) {}
}
