<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Squares2x2, Trash } from '@steeze-ui/heroicons';
	import type { ActionData, PageData } from './$types';
	import ActionCard from '$lib/components/ActionCard.svelte';
	import { deleteResource } from '$lib/api/deleteResource';
	import { flip } from 'svelte/animate';

	export let data: PageData;
	export let form: ActionData;
</script>

<ul class="flex flex-col gap-4 py-4">
	{#each data.boards as board (board.id)}
		<li animate:flip={{ duration: 300 }}>
			<Card href="/{board.id}">
				<div slot="title" class="group flex items-center gap-2">
					<Icon src={Squares2x2} size="20" />
					<h3>
						{board.name}
					</h3>
					<button
						on:click|stopPropagation|preventDefault={() => deleteResource('boards', board.id)}
						class="group-hover:block hidden ml-auto"
					>
						<Icon src={Trash} size="24" class="stroke-rose-500" />
					</button>
				</div>
			</Card>
		</li>
	{/each}

	<ActionCard errors={form?.errors} label="New Board" placeholder="Board Name..." />
</ul>
<slot />
