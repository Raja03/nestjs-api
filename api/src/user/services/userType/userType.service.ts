import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from 'src/global/constants';
import { CreateUserTypeDto } from 'src/user/dto/create-user-type.dto';
import { Repository } from 'typeorm';
import { UserTypeEntity } from '../../entities/user/userType.entity';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserTypeService {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, any>>,
    @InjectRepository(UserTypeEntity, 'db1')
    private userTypeRepository1: Repository<UserTypeEntity>,
    @InjectRepository(UserTypeEntity, 'db2')
    private userTypeRepository2: Repository<UserTypeEntity>,
    private readonly jwtService: JwtService,
  ) {}

  getUserDetailsRepository(): Repository<UserTypeEntity> {
    const token = this.asyncLocalStorage.getStore()?.get('token');
    const { dbName } = this.jwtService.parse(token);
    return dbName === 'db1'
      ? this.userTypeRepository1
      : this.userTypeRepository2;
  }

  async isUserTypeExists(type: string): Promise<UserTypeEntity | null> {
    return this.getUserDetailsRepository().findOne({
      where: {
        type,
      },
    });
  }

  async createUserType(
    userTypeDto: CreateUserTypeDto,
  ): Promise<UserTypeEntity> {
    // check if user type exists and send custom error message
    if (await this.isUserTypeExists(userTypeDto.type)) {
      throw new HttpException(
        'User type already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userTypePayload = {
      type: userTypeDto.type,
    };

    const newUserType = this.getUserDetailsRepository().create(userTypePayload);

    return await this.updateUserType(newUserType);
  }

  async updateUserType(newUserType: UserTypeEntity): Promise<UserTypeEntity> {
    return await this.getUserDetailsRepository().save(newUserType);
  }

  public getAll(): Promise<UserTypeEntity[]> {
    return this.getUserDetailsRepository().find({
      relations: { users: true },
    });
  }
}
