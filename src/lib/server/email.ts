import { Resend } from 'resend';
import { env } from './env';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
	const { data, error } = await resend.emails.send({
		from: 'noreply@ajxd2.dev',
		to,
		subject,
		html
	});

	if (error) {
		console.error(error);
		throw new Error('Failed to send email');
	}
	console.log(data);
	return data;
}
