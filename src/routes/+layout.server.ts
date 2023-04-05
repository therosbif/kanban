import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	const session = await event.locals.getSession();
	if (session?.user && !session?.user?.image) {
		const initialsUsername = session.user.name
			?.split(' ')
			.map((word) => word.at(0))
			.join('+');
		const initialsEmail = session.user.email
			?.split('@')
			.at(0)
			?.split('.')
			.map((word) => word.at(0))
			.join('+');

		session.user.image = `https://ui-avatars.com/api/?name=${
			initialsUsername || initialsEmail
		}&background=0D8ABC&color=fff`;
	}
	return {
		session
	};
}) satisfies LayoutServerLoad;
