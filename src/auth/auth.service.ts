import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/prisma.service';
import { CreateUserDto, loginUserDto, ValidateUserDto } from './dtos/user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: CreateUserDto): Promise<User> {
    const { email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async validateUser(userData: ValidateUserDto): Promise<User> {
    const { email, password } = userData;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    return user;
  }

  async login(userData: User) {
    const payload = { email: userData.email, id: userData.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserById(id: number): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
