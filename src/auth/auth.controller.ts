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
    return this.keycloakService.signup(
      signupDto.firstname,
      signupDto.lastname,
      signupDto.username,
      signupDto.email,
      signupDto.password,
    );
  }
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.keycloakService.login(loginDto.user, loginDto.password);
  }
  @Post('register')
  @ApiOperation({ summary: 'User register in database' })
  @ApiResponse({
    status: 200,
    description: 'User registerd in database in successfully',
  })
  async register(@Body() signupDto: SignupDto) {
    return this.keycloakService.registerUser(
      signupDto.firstname,
      signupDto.email,
      signupDto.password,
    );
  }
}
