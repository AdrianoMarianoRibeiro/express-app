import { inject, injectable } from 'tsyringe';
import { Body, Controller, Post, Req } from '../../decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';

@injectable()
@Controller('auth')
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    return this.authService.refreshToken(request);
  }

  @Post('logout')
  async logout() {
    // Com tokens stateless, o logout é principalmente no lado do cliente
    // O cliente deve descartar seus tokens
    return { message: 'Logged out successfully' };
  }
}
