import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('News API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.engine(
    'hbs',
    engine({
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      defaultLayout: 'layout',
      extname: 'hbs',
    }),
  );
  hbs.registerPartials(__dirname + '/views/partials');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
