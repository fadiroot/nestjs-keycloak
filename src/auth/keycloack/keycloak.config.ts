import { Injectable } from '@nestjs/common';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  private readonly configService: ConfigService;
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.configService.get('KEYCLOAK_BASE_URL'), // might be http://localhost:8080/auth for older keycloak versions
      realm: this.configService.get('KEYCLOAK_REALM'),
      clientId: this.configService.get('KEYCLOAK_CLIENT_ID'),
      secret: this.configService.get('KEYCLOAK_CLIENT_SECRET'),
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    };
  }
}
