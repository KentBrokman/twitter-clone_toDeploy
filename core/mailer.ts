import nodemailer from 'nodemailer'


export const mailer = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST || "smtp.mailtrap.io",
    port: Number(process.env.NODEMAILER_PORT) || 2525,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});