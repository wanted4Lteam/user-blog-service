import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StasticsService {
  constructor(
    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.userrepository.find();
  }

  async findByGender(gender: string) {
    return await this.userrepository.findBy({ gender: gender });
  }

  async findByAge(age: number) {
    return await this.userrepository.findBy({
      age: Between(age, age - 0 + 9),
    });
  }

  async findByConnected() {}
}
