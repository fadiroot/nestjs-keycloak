import { Module, Options } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import * as joi from 'joi'
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true,
    validationSchema : joi.object({
      DB_HOST : joi.string().required(),
      DB_PORT : joi.string().required(),
      DB_NAME : joi.string().required(),
      DB_USER : joi.string().required(),
      DB_PASS : joi.string().required()

    })
  }),CategoryModule, ProductModule],
  controllers: [AppController, ],
  providers: [AppService],
})
export class AppModule {}
