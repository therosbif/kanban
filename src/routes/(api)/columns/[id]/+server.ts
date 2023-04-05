import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { z } from 'zod';
import { setDebugMode } from 'svelte-dnd-action';
setDebugMode(true);

export const DELETE = (async ({ locals, params }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) throw redirect(307, '/auth');

	const id = params.id;
	const column = await prisma.column.findFirst({
		where: {
			id,
			board: {
				user: { email: session.user.email }
			}
		}
	});

	if (!column) throw redirect(307, '/');
	await prisma.column.delete({
		where: {
			id
		}
	});

	return new Response(undefined, {
		status: 204
	});
}) satisfies RequestHandler;

const patchColumnSchema = z.object({
	name: z.string().optional(),
	tasks: z.string().cuid().array().optional()
});

export const PATCH = (async ({ locals, params, request }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) throw redirect(307, '/auth');

	const id = params.id;

	const rawBody = await request.json();
	const body = patchColumnSchema.parse(rawBody);

	const oldColumn = await prisma.column.findFirst({
		where: {
			id,
			board: {
				user: { email: session.user.email }
			},
			tasks: {
				every: {
					id: {
						in: body.tasks
					}
				}
			}
		},
		select: {
			name: true
		}
	});

	if (!oldColumn) throw redirect(307, '/');

	let i = 0;
	const tasks = body.tasks?.map((id) => ({ id, position: i++ }));

	const column = await prisma.column.update({
		where: { id },
		data: {
			name: body.name,
			tasks: {
				set: tasks?.map(({ id }) => ({ id })),
				updateMany: tasks?.map(({ id, position }) => ({
					where: { id },
					data: { position }
				}))
			}
		}
	});

	return new Response(JSON.stringify(column), {
		status: 201
	});
}) satisfies RequestHandler;
