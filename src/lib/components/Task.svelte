<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { Task } from '@prisma/client';
	import { Pencil, Trash } from '@steeze-ui/heroicons';

	export let task: Task;
</script>

<Card>
	<h3 slot="title" class="flex items-center">
		{task.name}
		<Icon src={Pencil} size="16" class="ml-2 stroke-gray-400 group-hover:block hidden" />
		<button on:click|preventDefault class="group-hover:block hidden ml-auto">
			<Icon src={Trash} size="16" class="stroke-rose-500" />
		</button>
	</h3>
</Card>
