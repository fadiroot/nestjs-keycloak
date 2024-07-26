import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/auth.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class KeycloakService {
  private keycloakUrl: string;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.keycloakUrl = this.configService.get('KEYCLOAK_BASE_URL');
    this.realm = this.configService.get('KEYCLOAK_REALM');
    this.clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    this.clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
  }

  async signup(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
  ): Promise<any> {
    try {
      // Step 1: Get admin token
      const adminToken = await this.getAdminToken();

      // Step 2: Create user using admin token
      const userUrl = `${this.keycloakUrl}/admin/realms/${this.realm}/users`;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `bearer ${adminToken}`,
      };
      const userData = {
        username: username,
        email: email,
        enabled: true,
        firstName: firstName,
        lastName: lastName,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      };

      const res = await firstValueFrom(
        this.httpService.post(userUrl, userData, { headers }),
      );

      console.log('resonse is : ', res);
      const user: User = new User();
      user.username = firstName;
      user.email = email;
      user.password = password;
    } catch (error) {
      if (error.response) {
        // Capture and throw the status code along with the error message
        const { status } = error.response;
        if (status === 409) {
          throw new HttpException(
            'The user already exists',
            HttpStatus.CONFLICT,
          );
        }
      } else {
        return { message: 'somthing wrong' };

        throw new Error(error);
      }
    }
    return { message: 'user register successfully' };
  }
  async registerUser(
    firstName: string,
    email: string,
    password: string,
  ): Promise<any> {
    const user: User = new User();
    user.username = firstName;
    user.email = email;
    user.password = password;
    console.log(user);
    await this.userRepository.save(user);
    return { message: 'user register successfully' };
  }

  async login(username: string, password: string) {
    try {
      // Step 1: Get access token
      const accessToken = await this.getAccessToken(username, password);
      // Step 2: Use access token to fetch user data
      return { accessToken };
      // Return user data or any other relevant information
    } catch (error) {
      throw new Error(error);
    }
  }

  private async getAdminToken() {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);

    try {
      const tokenResponse = await firstValueFrom(
        this.httpService.post(url, params),
      );
      return tokenResponse.data.access_token;
    } catch (error) {
      throw new Error('Failed to obtain admin token');
    }
  }

  private async getAccessToken(username: string, password: string) {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('username', username);
    params.append('password', password);

    try {
      const tokenResponse = await firstValueFrom(
        this.httpService.post(url, params),
      );
      return tokenResponse.data.access_token;
    } catch (error) {
      throw new Error('Failed to obtain access token');
    }
  }

  private async getUserInfo(accessToken: string) {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user information');
    }
  }
}
