import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDbConnDto } from '../../dto/create-user-db-conn.dto';
import { UserDbConnEntity } from '../../entities/master/userDbConn.entity';

@Injectable()
export class UserDbConnService {
  constructor(
    @InjectRepository(UserDbConnEntity, 'db0')
    private userDbConnRepository: Repository<UserDbConnEntity>,
  ) {}

  async createUserDbConn(dto: CreateUserDbConnDto): Promise<UserDbConnEntity> {
    return await this.userDbConnRepository.save(dto);
  }
}
