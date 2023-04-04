import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/prisma';
import { z } from 'zod';
import { flattenZodErrors } from '$lib/flattenZodErrors';

export const load = (async ({ params, parent }) => {
	const { session } = await parent();
	if (!session?.user?.email) throw redirect(307, '/auth');

	const { id } = params;
	const board = await prisma.board.findFirst({
		where: {
			id,
			user: {
				email: session.user.email
			}
		},
		include: {
			columns: {
				include: {
					tasks: true
				}
			}
		}
	});
	if (!board) throw redirect(307, '/');

	return { board };
}) satisfies PageServerLoad;

const createColumnSchema = z.object({
	name: z.string().min(3).max(30)
});

const createTaskSchema = z.object({
	name: z.string().min(3).max(30),
	columnId: z.string().cuid()
});

export const actions = {
	createColumn: async ({ params, request, locals }) => {
		const session = await locals.getSession();
		if (!session?.user?.email) throw redirect(307, '/auth');

		const rawData = Object.fromEntries(await request.formData());
		const data = createColumnSchema.safeParse(rawData);
		if (!data.success) {
			const errors = flattenZodErrors(data.error.errors);
			return fail(400, { error: true, action: 'column', columnId: undefined, errors } as const);
		}

		const { id } = params;
		await prisma.column.create({
			data: {
				name: data.data.name,
				board: {
					connect: { id }
				}
			}
		});

		return { error: false, action: 'column' } as const;
	},
	createTask: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session?.user?.email) throw redirect(307, '/auth');

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);
		const data = createTaskSchema.safeParse(rawData);

		if (!data.success) {
			const columnId = formData.get('columnId')?.toString();
			const errors = flattenZodErrors(data.error.errors);
			return fail(400, {
				error: true,
				action: 'task',
				columnId,
				errors
			} as const);
		}

		await prisma.task.create({
			data: {
				name: data.data.name,
				column: {
					connect: { id: data.data.columnId }
				}
			}
		});

		return { error: false, action: 'task' } as const;
		// throw redirect(307, `/${params.id}`);
	}
} satisfies Actions;
