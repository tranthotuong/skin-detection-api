import { Body, Controller, Post, Put, UseGuards, Request, BadRequestException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenValidationGuard } from 'src/guards/token-validation.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signUp(@Body() { email, password }) {
    return this.authService.signUp(email, password);
  }

  @Post('login')
  async login(@Body() { email, password, loginIP }) {
    return this.authService.login(email, password, loginIP);
  }

  // GET /sports
  @Put('update')
  @UseGuards(TokenValidationGuard)
  async updateAccountInfo(
    @Request() req, // Access user data attached by the guard
    @Body()
    updateData: Partial<{
      colPic: string;
      sports: number[];
      name: string;
      dayOfBirth: Date;
      periodicitySport: string[];
      gender: string;
      loginIP: string;
      device: string;
    }>,
  ) {
    const { user } = req;

    if (!user) {
      throw new BadRequestException('Invalid user session');
    }

    return this.authService.updateAccountInfo(user.email, updateData);
  }

  @Get('user')
  @UseGuards(TokenValidationGuard)
  async getUserInfor(@Request() req){
    const { user } = req;
    return user;
  }
}
