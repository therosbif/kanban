<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { Task } from '@prisma/client';
	import { Trash } from '@steeze-ui/heroicons';

	export let task: Task;
</script>

<Card>
	<h3 slot="title" class="flex items-center justify-between">
		{task.name}
		<button on:click class="group-hover:block hidden">
			<Icon src={Trash} size="16" class="stroke-rose-500" />
		</button>
	</h3>
</Card>
