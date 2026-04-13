import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private async createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.error('SMTP config manquante:', {
        SMTP_HOST: host,
        SMTP_PORT: port,
        SMTP_SECURE: secure,
        SMTP_USER: user ? 'OK' : 'MANQUANT',
        SMTP_PASS: pass ? 'OK' : 'MANQUANT',
      });

      throw new InternalServerErrorException(
        'Configuration SMTP manquante dans le fichier .env',
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    await transporter.verify();
    return transporter;
  }

  async sendPasswordResetCode(
    to: string,
    code: string,
    prenom?: string,
  ): Promise<void> {
    try {
      const transporter = await this.createTransporter();

      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject: 'DermaScan - Code de vérification',
        text: `Bonjour ${prenom || ''}, votre code de vérification est : ${code}. Il expire dans 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#00C6A7;">DermaScan</h2>
            <p>Bonjour ${prenom || ''},</p>
            <p>Voici votre code de vérification :</p>
            <div style="font-size: 30px; font-weight: bold; letter-spacing: 6px; margin: 20px 0;">
              ${code}
            </div>
            <p>Ce code expire dans <strong>10 minutes</strong>.</p>
            <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
          </div>
        `,
      });

      console.log(`Email envoyé avec succès à ${to}`);
    } catch (error: any) {
      console.error('Erreur SMTP détaillée:', error);
      throw new InternalServerErrorException(
        "Impossible d'envoyer l'email de vérification",
      );
    }
  }
}