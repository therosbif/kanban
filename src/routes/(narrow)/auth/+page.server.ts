import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const { session } = await event.parent();
	if (session) throw redirect(307, '/');

	return {
		redirect: event.url.searchParams.get('redirect') || '/'
	};
}) satisfies PageServerLoad;
