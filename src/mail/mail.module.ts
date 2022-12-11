import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://vidmantest@mail.ru:h4wKeGmZStWQJCBWsVVE@smtp.mail.ru',
      defaults: {
        from: `"NestJS робот" <vidmantest@mail.ru>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
