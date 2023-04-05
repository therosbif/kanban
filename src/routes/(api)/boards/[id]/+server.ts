import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { z } from 'zod';

export const DELETE = (async ({ locals, params }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) throw redirect(307, '/auth');

	const id = params.id;
	const board = await prisma.board.findFirst({
		where: {
			id,
			user: { email: session.user.email }
		}
	});

	if (!board) throw redirect(307, '/');
	await prisma.board.delete({
		where: {
			id
		}
	});

	return new Response(undefined, {
		status: 204
	});
}) satisfies RequestHandler;

const patchBoardSchema = z.object({
	name: z.string().optional(),
	columns: z.string().cuid().array().optional()
});

export const PATCH = (async ({ locals, params, request }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) throw redirect(307, '/auth');

	const id = params.id;

	const rawBody = await request.json();
	const body = patchBoardSchema.parse(rawBody);

	const oldBoard = await prisma.board.findFirst({
		where: {
			id,
			user: { email: session.user.email },
			columns: {
				every: {
					id: { in: body.columns }
				}
			}
		},
		select: {
			name: true,
			columns: {
				select: { id: true }
			}
		}
	});

	if (!oldBoard) throw redirect(307, '/');

	let i = 0;
	const columns = body.columns?.map((id) => ({ id, position: i++ }));

	const board = await prisma.board.update({
		where: { id },
		data: {
			name: body.name,
			columns: {
				updateMany: columns?.map(({ id, position }) => ({
					where: { id },
					data: { position }
				}))
			}
		},
		include: {
			columns: {
				include: {
					tasks: {
						orderBy: {
							position: 'asc'
						}
					}
				},
				orderBy: {
					position: 'asc'
				}
			}
		}
	});

	return new Response(JSON.stringify(board), {
		status: 201
	});
}) satisfies RequestHandler;
