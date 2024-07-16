import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import * as joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakAuthGuard } from './auth/guards/keyclaok-authz.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DB_HOST: joi.string().required(),
        DB_PORT: joi.string().required(),
        DB_NAME: joi.string().required(),
        DB_USER: joi.string().required(),
        DB_PASS: joi.string().required(),
        KEYCLOAK_URL_AUTH: joi.string().required(),
      }),
    }),
    {
      global: true,
      ...HttpModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          baseURL: config.get<string>('KEYCLOAK_URL_AUTH'),
        }),
      }),
    },
    CategoryModule,
    ProductModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: KeycloakAuthGuard,
    },
  ],
})
export class AppModule {}
