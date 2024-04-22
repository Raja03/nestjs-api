import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from 'src/global/constants';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserEntity } from '../../entities/user/user.entity';
import { UserRoleEntity } from '../../entities/user/userRole.entity';
import { JwtService } from '../jwt/jwt.service';
import { PasswordService } from '../password/password.service';
import { UserDbConnService } from '../userDbConn/userDbConn.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, any>>,
    @InjectRepository(UserEntity, 'db1')
    private usersRepository1: Repository<UserEntity>,
    @InjectRepository(UserEntity, 'db2')
    private usersRepository2: Repository<UserEntity>,
    @Inject(UserDbConnService)
    private userDbConnService: UserDbConnService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  getUserRepository(db?: string): Repository<UserEntity> {
    if (db) {
      return db === 'db1' ? this.usersRepository1 : this.usersRepository2;
    } else {
      const random = Math.random() < 0.5;
      return random ? this.usersRepository1 : this.usersRepository2;
    }
  }

  getDbNameFromRepository(userRepository: Repository<UserEntity>): string {
    return (
      userRepository.manager.connection.options.database?.toString() || 'db1'
    );
  }

  getDbNameFromToken(): string {
    const token = this.asyncLocalStorage.getStore()?.get('token');
    const { dbName } = this.jwtService.parse(token);
    return dbName;
  }

  async isUserExists(
    email: string,
  ): Promise<{ user: UserEntity; dbName: string } | null> {
    const userRepositories = [this.usersRepository1, this.usersRepository2];
    for (const userRepository of userRepositories) {
      const user = await userRepository.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (user) {
        const dbName = this.getDbNameFromRepository(userRepository);
        return { user, dbName };
      }
    }
    return null;
  }

  async isUserIdExists(id: number, dbName: string): Promise<UserEntity | null> {
    return this.getUserRepository(dbName).findOne({
      where: {
        id,
      },
    });
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const userPayload = {
      email: userDto.email.toLowerCase(),
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      passwordHash: await this.passwordService.generate(userDto.password),
      typeId: userDto.typeId,
      roles: userDto.roles,
    };

    const usersRepository = this.getUserRepository();
    let newUser = usersRepository.create(userPayload);
    const dbName = this.getDbNameFromRepository(usersRepository);
    newUser = await this.updateUser(newUser, dbName);

    newUser.token = this.getUserToken(newUser, dbName);
    newUser.userRoles = userDto.roles.map((id) => ({
      ...new UserRoleEntity(),
      id,
    }));
    const createdUser = await this.updateUser(newUser, dbName);
    const userId = createdUser.id;
    await this.userDbConnService.createUserDbConn({
      userId,
      dbName,
    });
    return createdUser;
  }

  async updateUser(newUser: UserEntity, dbname: string): Promise<UserEntity> {
    return await this.getUserRepository(dbname).save(newUser);
  }

  async deleteUserById(id: number): Promise<void> {
    const dbName = this.getDbNameFromToken();
    if (!(await this.isUserIdExists(id, dbName))) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.getUserRepository(dbName).delete(id);
  }

  async editUser(userToUpdate: UpdateUserDto): Promise<UserEntity> {
    const dbName = this.getDbNameFromToken();
    if (!(await this.isUserIdExists(userToUpdate.id, dbName))) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updateUserPayload = {
      id: userToUpdate.id,
      ...(userToUpdate.firstName && { firstName: userToUpdate.firstName }),
      ...(userToUpdate.lastName && { lastName: userToUpdate.lastName }),
    };
    return await this.getUserRepository(dbName).save(updateUserPayload);
  }

  async checkUserPassword(
    user: UserEntity,
    requestPassword: string,
  ): Promise<boolean> {
    return this.passwordService.compare(requestPassword, user.passwordHash);
  }

  public getUserToken(user: UserEntity, dbName: string): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email.toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      dbName,
    });
  }

  public async getUserById(id: number): Promise<UserEntity | null> {
    const user = await this.getUserRepository(
      this.getDbNameFromToken(),
    ).findOne({
      where: {
        id,
      },
      order: {
        createdAt: 'ASC',
      },
      relations: {
        userDetails: true,
        userType: true,
        userRoles: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        userType: {
          id: true,
          type: true,
        },
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  public getAll(): Promise<UserEntity[]> {
    return this.getUserRepository(this.getDbNameFromToken()).find({
      order: {
        createdAt: 'ASC',
      },
      relations: {
        userDetails: true,
        userType: true,
        userRoles: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        userType: {
          id: true,
          type: true,
        },
      },
    });
  }
}
