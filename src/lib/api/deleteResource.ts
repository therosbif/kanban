import { invalidateAll } from '$app/navigation';

export async function deleteResource(resource: 'tasks' | 'columns' | 'boards', id: string) {
	await fetch(`/${resource}/${id}`, {
		method: 'DELETE'
	});
	invalidateAll();
}
