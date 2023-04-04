import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { z } from 'zod';
import { flattenZodErrors } from '$lib/flattenZodErrors';

export const load = (async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) throw redirect(303, '/auth');

	const boards = await prisma.board.findMany({
		where: {
			user: {
				email: session.user.email
			}
		},
		select: {
			id: true,
			name: true
		},
		orderBy: {
			updatedAt: 'desc'
		}
	});

	return {
		boards
	};
}) satisfies PageServerLoad;

const createBoardScema = z.object({ name: z.string().min(3).max(30) });

export const actions = {
	default: async (event) => {
		const session = await event.locals.getSession();
		if (!session?.user?.email) throw redirect(303, '/auth');

		const rawData = Object.fromEntries(await event.request.formData());
		console.log('rawData', rawData);
		const data = createBoardScema.safeParse(rawData);
		if (!data.success) {
			const errors = flattenZodErrors(data.error.errors);
			return fail(400, { error: true, errors });
		}

		const board = await prisma.board.create({
			data: {
				name: data.data.name,
				user: {
					connect: {
						email: session.user.email
					}
				}
			}
		});

		throw redirect(303, `/${board.id}`);
	}
} satisfies Actions;
