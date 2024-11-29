import { Injectable, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenValidationGuard {
  constructor(private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization']; // Extract the Authorization header

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Authorization header is missing or invalid');
    }
    // Extract the tokenKey from the Authorization header
    const tokenKey = authorizationHeader.split(' ')[1];
    const email = request.headers['email']; // Extract email from header

    if (!tokenKey || !email) {
      throw new ForbiddenException('Token or email is missing');
    }

    // Validate token and email in the database (assuming tbAccountInfo is the table with tokenKey and email)
    const account = await this.prisma.tbAccountInfo.findUnique({
      where: {
        tokenKey: tokenKey,
        email: email,
      },
    });

    if (!account) {
      throw new UnauthorizedException('Invalid token or email');
    }

    // Assuming the token has an expiry field to check against
    const currentDate = new Date();
    if (new Date(account.tokenExpiresAt) < currentDate) {
      throw new UnauthorizedException('Token has expired');
    }
    // Attach account info to request for further processing if needed
    request.user = account;
    // If token and email are valid, allow the request to continue
    return true;
  }
}
