<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Plus } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	let creatingColumn = false;

	function handleNewColumn() {
		invalidateAll();
		creatingColumn = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			creatingColumn = false;
		}
	}
</script>

<main class="from-indigo-700 bg-gradient-to-b to-whrit m-0 flex flex-col h-full">
	<h1 class="text-4xl font-extrabold text-gray-200 py-2 mx-4 text-sl">{data.board.name}</h1>
	<section
		class="bg-indigo-100/80 m-4 p-2 rounded-md flex-1 flex overflow-x-auto gap-2 items-stretch"
	>
		{#each data.board.columns as column}
			<ul class="bg-white rounded-md p-2 flex-1 max-w-xs min-w-[16rem] gap-2 flex flex-col">
				<h2 class="text-2xl font-bold text-indigo-700 mt-0">{column.name}</h2>
				{#each column.tasks as task}
					<Card>
						<h3 slot="title">{task.name}</h3>
					</Card>
				{/each}
				<Card active>
					<div slot="title" class="flex items-center gap-2">
						<Icon src={Plus} size="20" />
						<h3>New Task</h3>
					</div>
				</Card>
			</ul>
		{/each}
		<ul class="bg-white rounded-md p-2 flex-1 max-w-xs">
			<Card active on:click={handleNewColumn} on:keydown={handleKeydown}>
				<div slot="title" class="flex items-center gap-2">
					<Icon src={Plus} size="20" />
					{#if creatingColumn}
						<form method="POST" action="?/createColumn" use:enhance class="flex flex-col gap-1">
							<!-- svelte-ignore a11y-autofocus -->
							<input
								type="text"
								name="name"
								placeholder="Column Name..."
								autofocus
								class="border-none text-lg placeholder:text-gray-300 bg-transparent rounded-md py-0 focus:border-indigo-700"
							/>
							{#if form?.error}
								{#each form.errors as error}
									<span
										class="text-sm font-normal bg-amber-400/90 px-2 py-1 rounded-md border border-amber-400 text-amber-800/80 ml-3"
									>
										{error.message}
									</span>
								{/each}
							{/if}
						</form>
					{:else}
						<h3>New Column</h3>
					{/if}
				</div>
			</Card>
		</ul>
	</section>
</main>
