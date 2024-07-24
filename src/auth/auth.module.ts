import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt-access.startegy';
import { configValidationSchema } from './keycloack/validateKeycloakSchema';
import { ConfigModule } from '@nestjs/config';
import {
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { HttpModule } from '@nestjs/axios';
import { KeycloakConfigService } from './keycloack/keycloak.config';
import { KeycloakService } from './keycloack/keycloak.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080', // might be http://localhost:8080/auth for older keycloak versions
      realm: 'softylines',
      clientId: 'nestjs-app',
      secret: 'ypf4DWhWLZEcnwuC6IaQUTfEdg4qrwVP',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, KeycloakConfigService, KeycloakService],
})
export class AuthModule {}
