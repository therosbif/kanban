<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { ActionData, PageData } from './$types';
	import ActionCard from '$lib/components/ActionCard.svelte';

	export let data: PageData;
	export let form: ActionData;
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
				<ActionCard
					label="New Task"
					placeholder="Task Name..."
					action="?/createTask"
					errors={form?.action === 'task' ? form.errors : []}
					extraData={{ columnId: column.id }}
				>
					<input
						type="text"
						name="columnId"
						value={column.id}
						data-sveltekit-preload-data
						class="hidden"
					/>
				</ActionCard>
			</ul>
		{/each}
		<ul class="bg-white rounded-md p-2 flex-1 max-w-xs min-w-[16rem]">
			<ActionCard
				label="New Column"
				placeholder="Column Name..."
				action="?/createColumn"
				errors={form?.action === 'column' ? form.errors : []}
			/>
		</ul>
	</section>
</main>
