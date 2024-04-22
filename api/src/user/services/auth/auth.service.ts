import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { LoginDto } from '../../dto/login.dto';
import { UserEntity } from '../../entities/user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(userDto: CreateUserDto): Promise<UserEntity> {
    // check if user exists and send custom error message
    const userExists = await this.userService.isUserExists(userDto.email);
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.userService.createUser(userDto);
  }

  async login(loginRequest: LoginDto): Promise<string | void> {
    const { email, password } = loginRequest;
    const userResult = await this.userService.isUserExists(email);

    if (!userResult || !userResult.user) {
      return this.failLogin();
    }

    const { user, dbName } = userResult;

    if (await this.userService.checkUserPassword(user, password)) {
      const token = this.userService.getUserToken(user, dbName);
      user.token = token;
      await this.userService.updateUser(user, dbName);
      return token;
    }

    this.failLogin('Incorrect password');
  }

  private failLogin(message = 'Login failed') {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }
}
