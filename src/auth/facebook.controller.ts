import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('facebook')
export class FacebookController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req) {
    return this.authService.facebookLogin(req)
  }
}