import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('linkedin')
export class LinkedInController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('linkedin'))
  linkedinAuthRedirect(@Req() req) {
    return this.authService.linkedinLogin(req)
  }
}