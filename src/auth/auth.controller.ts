import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { KeycloakService } from './keycloack/keycloak.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly configService: ConfigService,
  ) {}
  @Post('signup')
  @ApiOperation({ summary: 'User SignUp' })
  @ApiResponse({ status: 200, description: 'User registerd in successfully' })
  async signup(@Body() signupDto: SignupDto) {
    return this.keycloakService.signup(signupDto);
  }
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.keycloakService.login(loginDto.user, loginDto.password);
  }
}
