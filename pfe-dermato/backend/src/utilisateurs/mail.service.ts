import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private async createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const secure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === 'true'
        : port === 465;

    if (!host || !user || !pass) {
      console.error('SMTP config manquante:', {
        SMTP_HOST: host || 'MANQUANT',
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
    console.log('SMTP connecté avec succès');
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

  async sendLoginAlert(
    to: string,
    prenom?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      const transporter = await this.createTransporter();

      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject: 'DermaScan - Nouvelle connexion détectée',
        text: `Bonjour ${prenom || ''}, une nouvelle connexion à votre compte a été détectée. IP: ${ip || 'inconnue'} | Appareil: ${userAgent || 'inconnu'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#00C6A7;">DermaScan</h2>
            <p>Bonjour ${prenom || ''},</p>
            <p>Une nouvelle connexion à votre compte a été détectée.</p>
            <p><strong>IP :</strong> ${ip || 'inconnue'}</p>
            <p><strong>Appareil :</strong> ${userAgent || 'inconnu'}</p>
            <p>Si ce n’était pas vous, changez votre mot de passe immédiatement.</p>
          </div>
        `,
      });

      console.log(`Alerte de connexion envoyée à ${to}`);
    } catch (error: any) {
      console.error('Erreur SMTP alerte connexion:', error);
      throw new InternalServerErrorException(
        "Impossible d'envoyer l'alerte email",
      );
    }
  }
}