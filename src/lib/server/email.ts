import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

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
	return data;
}
