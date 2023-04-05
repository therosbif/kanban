import { goto, invalidateAll } from '$app/navigation';

export async function deleteResource(resource: 'tasks' | 'columns' | 'boards', id: string) {
	await fetch(`/${resource}/${id}`, {
		method: 'DELETE'
	});

	if (resource === 'boards') {
		goto('/');
	} else {
		invalidateAll();
	}
}
