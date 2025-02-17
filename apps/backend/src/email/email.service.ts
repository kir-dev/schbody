import { Injectable } from '@nestjs/common';
import { ProfilePictureStatus } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  private emailApiUrl = process.env.KIR_MAIL_URL;
  private apiKey = process.env.KIR_MAIL_TOKEN;

  async sendEmail(address: string, subject: string, message: string) {
    try {
      return await fetch(this.emailApiUrl + '/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Api-Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: {
            name: 'SCHBody',
            email: 'noreply@kir-dev.hu',
          },
          to: address,
          subject,
          html: message,
          replyTo: 'replyto@kir-dev.hu',
          queue: 'send',
        }),
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async sendTemplateEmail(address: string, subject: string, template: string) {
    const html = this.getHtmlTemplate(template);
    const namedHtml = html.replace(/{{name}}/g, address);
    return await this.sendEmail(address, subject, namedHtml);
  }

  async sendProfilePictureStatusChangeEmail(
    name: string,
    address: string,
    status: ProfilePictureStatus,
    hadActiveApplication: boolean
  ) {
    const html = this.getHtmlTemplate(
      status === ProfilePictureStatus.ACCEPTED ? 'picture-accepted.html' : 'picture-rejected.html'
    );
    const namedHtml = html.replace(/{{name}}/g, name);

    const response = await this.sendEmail(
      address,
      status === ProfilePictureStatus.ACCEPTED ? 'Profilképed elfogadva' : 'Profilképed elutasítva',
      namedHtml
    );
  }

  private getHtmlTemplate(fileName: string): string {
    return readFileSync(join(process.cwd(), 'email-templates', fileName), 'utf8');
  }
}
