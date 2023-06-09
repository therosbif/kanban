import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const DELETE = (async ({ locals, params }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) throw redirect(307, '/auth');

	const id = params.id;
	const task = await prisma.task.findFirst({
		where: {
			id,
			column: {
				board: {
					user: { email: session.user.email }
				}
			}
		}
	});

	if (!task) throw redirect(307, '/');
	await prisma.task.delete({
		where: {
			id
		}
	});

	return new Response(undefined, {
		status: 204
	});
}) satisfies RequestHandler;
