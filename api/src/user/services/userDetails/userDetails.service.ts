import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from 'src/global/constants';
import { Repository } from 'typeorm';
import { UserDetailsEntity } from '../../entities/user/userDetails.entity';
import { CreateUserDetailsDto } from '../../dto/create-user-details.dto';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserDetailsService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(ASYNC_STORAGE)
    private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, any>>,
    @InjectRepository(UserDetailsEntity, 'db1')
    private userDetailsRepository1: Repository<UserDetailsEntity>,
    @InjectRepository(UserDetailsEntity, 'db2')
    private userDetailsRepository2: Repository<UserDetailsEntity>,
    private readonly jwtService: JwtService,
  ) {}

  getUserDetailsRepository(dbName: string): Repository<UserDetailsEntity> {
    return dbName === 'db1'
      ? this.userDetailsRepository1
      : this.userDetailsRepository2;
  }

  getDbNameFromToken(): string {
    const token = this.asyncLocalStorage.getStore()?.get('token');
    const { dbName } = this.jwtService.parse(token);
    return dbName;
  }

  async isUserDetailsExists(
    userId: number,
    dbName: string,
  ): Promise<UserDetailsEntity | null> {
    return this.getUserDetailsRepository(dbName).findOne({
      where: {
        userId,
      },
    });
  }

  async createUserDetails(
    userDetailsDto: CreateUserDetailsDto,
  ): Promise<UserDetailsEntity> {
    const dbName = this.getDbNameFromToken();
    // check if user exists and send custom error message
    if (
      !(await this.userService.isUserIdExists(userDetailsDto.userId, dbName))
    ) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    // check if user details exists and send custom error message
    if (await this.isUserDetailsExists(userDetailsDto.userId, dbName)) {
      throw new HttpException(
        'User details already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userDetailsPayload = {
      userId: userDetailsDto.userId,
      city: userDetailsDto.city,
      country: userDetailsDto.country,
    };

    const newUserDetails =
      this.getUserDetailsRepository(dbName).create(userDetailsPayload);

    return await this.updateUserDetails(newUserDetails);
  }

  async updateUserDetails(
    newUserDetails: UserDetailsEntity,
  ): Promise<UserDetailsEntity> {
    const dbName = this.getDbNameFromToken();
    return await this.getUserDetailsRepository(dbName).save(newUserDetails);
  }

  public getAll(): Promise<UserDetailsEntity[]> {
    const dbName = this.getDbNameFromToken();
    return this.getUserDetailsRepository(dbName).find();
  }
}
