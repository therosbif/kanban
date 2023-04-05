<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import ActionCard from '$lib/components/ActionCard.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Trash } from '@steeze-ui/heroicons';
	import { flip } from 'svelte/animate';
	import { deleteResource } from '$lib/api/deleteResource';
	import Task from './Task.svelte';
	import ColumnTitle from './ColumnTitle.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndColumnsEvent, DndTasksEvent } from './types';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	const flipDurationMs = 300;

	function handleDndConsiderColumns(e: DndColumnsEvent) {
		data.board.columns = e.detail.items;
	}
	async function handleDndFinalizeColumns(e: DndColumnsEvent) {
		data.board.columns = e.detail.items;

		await fetch(`/boards/${data.board.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ columns: data.board.columns.map((c) => c.id) })
		});
		invalidate(`/${data.board.id}`);
	}
	function handleDndConsiderCards(cid: string, e: DndTasksEvent) {
		const colIdx = data.board.columns.findIndex((c) => c.id === cid);
		data.board.columns[colIdx].tasks = e.detail.items;
		data.board.columns = [...data.board.columns];
	}
	async function handleDndFinalizeCards(cid: string, e: DndTasksEvent) {
		const colIdx = data.board.columns.findIndex((c) => c.id === cid);
		data.board.columns[colIdx].tasks = e.detail.items;
		data.board.columns = [...data.board.columns];

		await fetch(`/columns/${data.board.columns[colIdx].id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ tasks: data.board.columns[colIdx].tasks.map((c) => c.id) })
		});
		invalidate(`/${data.board.id}`);
	}
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
		use:dndzone={{
			items: data.board.columns,
			flipDurationMs,
			type: 'columns'
		}}
		on:consider={handleDndConsiderColumns}
		on:finalize={handleDndFinalizeColumns}
		class="bg-indigo-100/80 m-4 p-2 rounded-md flex-1 flex overflow-x-auto gap-2 items-stretch"
	>
		{#each data.board.columns as column (column.id)}
			<ul
				animate:flip={{ duration: flipDurationMs }}
				class="bg-white flex-1 rounded-md p-2 max-w-sm min-w-[22rem] gap-2 flex flex-col"
			>
				<ColumnTitle title={column.name} on:click={() => deleteResource('columns', column.id)} />
				<div
					use:dndzone={{
						items: column.tasks,
						flipDurationMs
					}}
					on:consider={(e) => handleDndConsiderCards(column.id, e)}
					on:finalize={(e) => handleDndFinalizeCards(column.id, e)}
					class="flex-1 overflow-y-auto gap-2 flex flex-col min-h-[22rem] max-h-[calc(100vh-22rem)]"
				>
					{#each column.tasks as task (task.id)}
						<div animate:flip={{ duration: flipDurationMs }}>
							<Task {task} on:click={() => deleteResource('tasks', task.id)} />
						</div>
					{/each}
				</div>
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
