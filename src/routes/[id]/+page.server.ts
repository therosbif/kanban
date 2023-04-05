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
	if (!board) throw redirect(307, '/');

	return { board };
}) satisfies PageServerLoad;

const createColumnSchema = z.object({
	name: z.string().min(1).max(30)
});

const createTaskSchema = z.object({
	name: z.string().min(1).max(30)
});

const editTaskSchema = z
	.object({
		name: z.string().min(1).max(30),
		description: z.string().min(1).max(1000)
	})
	.partial();

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
	createTask: async ({ request, locals, url }) => {
		const session = await locals.getSession();
		if (!session?.user?.email) throw redirect(307, '/auth');

		const columnId = url.searchParams.get('columnId');
		if (!columnId)
			return fail(400, {
				error: true,
				action: 'createTask',
				columnId: undefined,
				errors: [{ field: 'columnId', message: 'No Id specified' }]
			});

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);
		const data = createTaskSchema.safeParse(rawData);

		if (!data.success) {
			const errors = flattenZodErrors(data.error.errors);
			return fail(400, {
				error: true,
				action: 'createTask',
				columnId,
				errors
			});
		}

		await prisma.task.create({
			data: {
				name: data.data.name,
				column: {
					connect: { id: columnId }
				}
			}
		});

		return { error: false, action: 'createTask' };
		// throw redirect(307, `/${params.id}`);
	},
	editTask: async ({ request, locals, url }) => {
		const session = await locals.getSession();
		if (!session?.user?.email) throw redirect(307, '/auth');

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);
		const data = editTaskSchema.safeParse(rawData);

		if (!data.success) {
			const columnId = formData.get('columnId')?.toString();
			const errors = flattenZodErrors(data.error.errors);
			return fail(400, {
				error: true,
				action: 'editTask',
				columnId,
				errors
			} as const);
		}

		const id = url.searchParams.get('taskId');
		if (!id)
			return fail(400, {
				error: true,
				action: 'editTask',
				errors: [{ field: 'editId', message: 'No Id specified' }]
			} as const);

		await prisma.task.update({
			where: { id },
			data: {
				name: data.data.name,
				description: data.data.description
			}
		});

		return { error: false, action: 'editTask' } as const;
	}
} satisfies Actions;
