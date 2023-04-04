<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Plus, Squares2x2 } from '@steeze-ui/heroicons';
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let creating = false;

	function handleNewBoard() {
		creating = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			creating = false;
		}
	}
</script>

<ul class="flex flex-col gap-4 py-4">
	{#each data.boards as board}
		<Card href="boards/{board.id}">
			<div slot="title" class="flex items-center gap-2">
				<Icon src={Squares2x2} size="20" />
				<h3>{board.name}</h3>
			</div>
		</Card>
	{/each}

	<Card active on:click={handleNewBoard} on:keydown={handleKeydown}>
		<div slot="title" class="flex items-center gap-2">
			<Icon src={Plus} size="20" />
			{#if creating}
				<form method="POST" use:enhance class="flex flex-col gap-1">
					<!-- svelte-ignore a11y-autofocus -->
					<input
						type="text"
						name="name"
						placeholder="Board Name..."
						autofocus
						class="border-none text-lg placeholder:text-gray-300 bg-transparent rounded-md py-0 focus:border-indigo-700"
					/>
					{#if form?.error}
						{#each form.errors as error}
							<span
								class="text-sm font-normal bg-amber-400/50 px-2 py-1 rounded-md border border-amber-400 text-amber-800/80 ml-3"
							>
								{error.message}
							</span>
						{/each}
					{/if}
				</form>
			{:else}
				<h3>Create Board</h3>
			{/if}
		</div>
	</Card>
</ul>
<slot />
