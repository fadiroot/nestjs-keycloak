import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakService {
  private keycloakUrl: string;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.keycloakUrl = this.configService.get('KEYCLOAK_BASE_URL');
    this.realm = this.configService.get('KEYCLOAK_REALM');
    this.clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    this.clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
  }

  async signup(signupDto) {
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
        username: signupDto.username,
        email: signupDto.email,
        enabled: true,
        firstName: signupDto.firstname,
        lastName: signupDto.lastname,
        credentials: [
          {
            type: 'password',
            value: signupDto.password,
            temporary: false,
          },
        ],
      };

      await firstValueFrom(
        this.httpService.post(userUrl, userData, { headers }),
      );

      return { message: 'User registered successfully' };
    } catch (error) {
      if (error.response) {
        // Capture and throw the status code along with the error message
        const { status } = error.response;
        if (status === 409) {
          return { message: 'the user already exist' };
        }
      } else {
        throw new Error(
          'Failed to register user: An unexpected error occurred',
        );
      }
    }
  }

  async login(username: string, password: string) {
    try {
      // Step 1: Get access token
      const accessToken = await this.getAccessToken(username, password);
      console.log(accessToken);
      // Step 2: Use access token to fetch user data
      const userInfo = await this.getUserInfo(accessToken);
      return { ...userInfo, accessToken };
      // Return user data or any other relevant information
    } catch (error) {
      throw new Error('Login failed');
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
