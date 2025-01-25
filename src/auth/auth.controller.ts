import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, loginUserDto } from './dtos/user.dto';
import { JwtAuthGuard } from './guard/jwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() userData: loginUserDto) {
    const user = await this.authService.validateUser(userData);
    return this.authService.login(user);
  }

  @Get('me/:id')
  @UseGuards(JwtAuthGuard)
  async me(@Param('id') id: number) {
    return this.authService.getUserById(+id);
  }
}
