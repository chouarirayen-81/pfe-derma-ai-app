import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('signup')
  signup(
    @Body()
    body: {
      nom: string;
      prenom: string;
      email: string;
      password: string;
    },
  ) {
    return this.adminAuthService.signup(body);
  }

  @Post('login')
  login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.adminAuthService.login(body.email, body.password);
  }
}