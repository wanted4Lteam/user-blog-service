import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StasticsService {
  constructor(
    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async findByGender(gender: string) {}

  async findByAge(age: number) {}

  async findByConnected() {}
}
