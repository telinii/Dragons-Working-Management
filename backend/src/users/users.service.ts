import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      timezone: dto.timezone ?? 'America/Sao_Paulo',
    });
    const saved = await this.repo.save(user);
    const { passwordHash: _, ...rest } = saved;
    return rest; // nunca retorna o hash
  }
  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  findAll() {
    return this.repo.find();
  }
}
