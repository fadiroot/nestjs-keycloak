import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServive: AuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const payload = new URLSearchParams({
      client_id: this.configService.get('KEYCLOAK_CLIENT_ID'),
      client_secret: this.configService.get('KEYCLOAK_CLIENT_SECRET'),
      scope: this.configService.get('KEYCLOAK_SCOPE'),
      grant_type: 'password',
      username: loginDto.user,
      password: loginDto.password,
    });
    const Keycloak_realm = this.configService.get('KEYCLOAK_REALM');

    try {
      const response = await this.httpService.axiosRef.post(
        `http://localhost:8080/realms/${Keycloak_realm}/protocol/openid-connect/token`,
        payload.toString(),
        { headers },
      );
      return response.data;
    } catch (error) {
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
        throw new BadRequestException(
          error.response.data.error_description || 'Invalid credentials',
        );
      }
      console.error('Request error:', error.message);
      throw new BadRequestException('Unable to process login request');
    }
  }
}
