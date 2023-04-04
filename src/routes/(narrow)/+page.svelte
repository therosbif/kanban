<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Squares2x2 } from '@steeze-ui/heroicons';
	import type { ActionData, PageData } from './$types';
	import ActionCard from '$lib/components/ActionCard.svelte';

	export let data: PageData;
	export let form: ActionData;
</script>

<ul class="flex flex-col gap-4 py-4">
	{#each data.boards as board}
		<Card href="/{board.id}">
			<div slot="title" class="flex items-center gap-2">
				<Icon src={Squares2x2} size="20" />
				<h3>{board.name}</h3>
			</div>
		</Card>
	{/each}

	<ActionCard errors={form?.errors} label="New Board" placeholder="Board Name..." />
</ul>
<slot />
