import { UserError } from '../user/user.error';

export class EmailSanitizer {
  static normalizeEmail(eMail: string) {
    if (typeof eMail !== 'string' || eMail === '')
      throw new Error(UserError.INVALID_EMAIL);
    const email = eMail.toLowerCase();
    const emailParts = email.split(/@/);
    if (emailParts.length !== 2) throw new Error(UserError.INVALID_EMAIL);
    const domainParts = emailParts[1].split('.');
    if (domainParts.length < 2) throw new Error(UserError.INVALID_EMAIL);
    return email;
  }
}
