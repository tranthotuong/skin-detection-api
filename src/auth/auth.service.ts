import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, comparePasswords } from './hash.util';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async signUp(email: string, password: string) {
    // Check if the email already exists
    const existingUser = await this.prisma.tbAccountInfo.findUnique({
      where: { email },
    });


    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.prisma.tbAccountInfo.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return {
      statusCode: HttpStatus.CREATED, // 201 Created
      message: 'User successfully created',
      success: true,
      user
    };
  }

  async login(email: string, password: string, loginIP: string) {
    const user = await this.prisma.tbAccountInfo.findUnique({ where: { email } });
    if (!user || !(await comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a new token if valid
    const tokenKey = this.jwtService.sign({ id: user.id, email: user.email });
    const accUserKey = this.generateRandomKey();
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 30);  // Set expiration to 30 days from now

    // Update the token and expiration time in the database
    await this.prisma.tbAccountInfo.update({
      where: { id: user.id },
      data: {
        tokenKey,
        accUserKey,
        loginIP,
        tokenExpiresAt: expirationTime,
      },
    });

    return { tokenKey, accUserKey };
  }

  async updateAccountInfo(
    email: string,
    updateData: Partial<{
      colPic: string;
      sports: number[];
      name: string;
      dayOfBirth: Date;
      periodicitySport: string[];
      gender: string;
      loginIP: string;
      device: string;
      firstLogin: boolean;
    }>,
  ) {
    const updatedAccount = await this.prisma.tbAccountInfo.update({
      where: { email },
      data: updateData,
    });

    return {
      message: 'Account information updated successfully',
      updatedAccount,
    };
  }

  private generateRandomKey() {
    return Math.random().toString(36).substring(2, 15);
  }
}
