import type { ZodIssue } from 'zod';

export function flattenZodErrors(errors: ZodIssue[]) {
	return errors.map((error) => {
		return {
			message: error.message,
			field: error.path[0]
		};
	});
}
