import { inject, injectable } from 'tsyringe';
import { Body, Controller, Post, Req, SkipAuth } from '../../decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';

@injectable()
@Controller('auth')
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    return this.authService.refreshToken(request);
  }

  @Post('logout')
  async logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
