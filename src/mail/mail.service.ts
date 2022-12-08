import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { News } from 'src/news/news.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    console.log('Отправляется письмо установки');

    return this.mailerService
      .sendMail({
        to: 'vidmantest@mail.ru',
        subject: 'Первое тестовое письмо',
        template: './test',
      })
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  async sendNewNewsForAdmins(emails: string[], news: News): Promise<void> {
    console.log('Отправляются письма о новой новости администрации ресурса');

    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Создана новость: ${news.title}`,
          template: './new-news',
          context: news,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
}
