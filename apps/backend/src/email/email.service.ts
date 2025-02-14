import { Injectable } from '@nestjs/common';
import { ProfilePictureStatus } from '@prisma/client';
import { render } from '@react-email/render';
import { profilePicStatusChangeEmail } from './templates/profilePicStatusChange';

@Injectable()
export class EmailService {
  private emailApiUrl = process.env.KIR_MAIL_URL;
  private apiKey = process.env.KIR_MAIL_TOKEN;

  async sendEmail(address: string, subject: string, message: string) {
    try {
      const response = await fetch(this.emailApiUrl + '/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Api-Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: {
            name: 'Kir-Dev',
            email: 'noreply@kir-dev.hu',
          },
          to: address,
          subject,
          html: message,
          replyTo: 'replyto@kir-dev.hu',
          queue: 'send',
        }),
      });
      console.log(response);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  async sendProfilePictureStatusChangeEmail(
    address: string,
    status: ProfilePictureStatus,
    hadActiveApplication: boolean
  ) {
    console.log('email');
    const html = await render(profilePicStatusChangeEmail(status, hadActiveApplication));
    const response = await this.sendEmail(
      address,
      status === ProfilePictureStatus.ACCEPTED ? 'Profilképed elfogadva' : 'Profilképed elutasítva',
      html
    );
  }
}
