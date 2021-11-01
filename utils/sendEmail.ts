import { mailer } from '../core/mailer'
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport";


type SendMailPropsType = {
    from: string,
    to: string,
    subject: string,
    html: string
}

export const sendEmail = (
    { from, to, subject, html }: SendMailPropsType,
    callback: (err: Error | null, info: SentMessageInfo) => void
) => {
    mailer.sendMail(
        {
            from,
            to,
            subject,
            html
        },
        callback || function (err: Error | null, info: SentMessageInfo) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        }
    );
}