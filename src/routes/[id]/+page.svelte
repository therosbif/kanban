<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { ActionData, PageData } from './$types';
	import ActionCard from '$lib/components/ActionCard.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Trash } from '@steeze-ui/heroicons';
	import { flip } from 'svelte/animate';
	import { deleteResource } from '$lib/api/deleteResource';

	export let data: PageData;
	export let form: ActionData;
</script>

<main class="from-indigo-700 bg-gradient-to-b to-whrit m-0 flex flex-col h-full">
	<h1 class="group flex gap-4 text-4xl font-extrabold text-gray-200 py-2 mx-4 text-sl">
		{data.board.name}
		<button
			on:click={() => deleteResource('boards', data.board.id)}
			class="group-hover:block hidden"
		>
			<Icon src={Trash} size="24" class="stroke-rose-500" />
		</button>
	</h1>
	<section
		class="bg-indigo-100/80 m-4 p-2 rounded-md flex-1 flex overflow-x-auto gap-2 items-stretch"
	>
		{#each data.board.columns as column (column.id)}
			<ul
				animate:flip={{ duration: 300 }}
				class="bg-white rounded-md p-2 flex-1 max-w-xs min-w-[22rem] gap-2 flex flex-col"
			>
				<h2 class="group flex justify-between text-2xl font-bold text-indigo-700 mt-0">
					{column.name}
					<button
						on:click={() => deleteResource('columns', column.id)}
						class="group-hover:block hidden"
					>
						<Icon src={Trash} size="16" class="stroke-rose-500" />
					</button>
				</h2>
				{#each column.tasks as task (task.id)}
					<div animate:flip={{ duration: 300 }}>
						<Card>
							<h3 slot="title" class="flex items-center justify-between">
								{task.name}
								<button
									on:click={() => deleteResource('tasks', task.id)}
									class="group-hover:block hidden"
								>
									<Icon src={Trash} size="16" class="stroke-rose-500" />
								</button>
							</h3>
						</Card>
					</div>
				{/each}
				<ActionCard
					label="New Task"
					placeholder="Task Name..."
					action="?/createTask"
					errors={form?.action === 'task' && form?.columnId === column.id ? form.errors : []}
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
		<ul class="bg-white rounded-md p-2 flex-1 max-w-xs min-w-[22rem]">
			<ActionCard
				label="New Column"
				placeholder="Column Name..."
				action="?/createColumn"
				errors={form?.action === 'column' ? form.errors : []}
			/>
		</ul>
	</section>
</main>
