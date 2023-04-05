import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	AUTH_SECRET,
	EMAIL_SERVER_HOST,
	EMAIL_SERVER_PORT,
	EMAIL_SERVER_USER,
	EMAIL_SERVER_PASSWORD,
	EMAIL_FROM
} from '$env/static/private';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './lib/prisma';
import Email, { type EmailConfig } from '@auth/core/providers/email';

export const handle = SvelteKitAuth({
	providers: [
		// @ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		Email({
			server: {
				host: EMAIL_SERVER_HOST,
				port: EMAIL_SERVER_PORT,
				auth: {
					user: EMAIL_SERVER_USER,
					pass: EMAIL_SERVER_PASSWORD
				}
			},
			from: EMAIL_FROM
		} as EmailConfig)
	],
	adapter: {
		...PrismaAdapter(prisma),
		deleteSession: (sessionToken) => {
			return prisma.session.deleteMany({ where: { sessionToken } });
		}
	},
	secret: AUTH_SECRET,
	trustHost: true
});
