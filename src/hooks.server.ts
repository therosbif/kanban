import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './lib/prisma';

export const handle = SvelteKitAuth({
	// @ts-expect-error issue https://github.com/nextauthjs/next-auth/issues/6174
	providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
	adapter: PrismaAdapter(prisma),
	secret: AUTH_SECRET,
	trustHost: true
});
