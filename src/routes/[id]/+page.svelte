<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import ActionCard from '$lib/components/ActionCard.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowLeft, Trash } from '@steeze-ui/heroicons';
	import { flip } from 'svelte/animate';
	import { deleteResource } from '$lib/api/deleteResource';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndColumnsEvent, DndTasksEvent } from './types';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import ColumnTitle from '$lib/components/ColumnTitle.svelte';
	import Task from '$lib/components/Task.svelte';

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

	let prevColumnId = '';

	function handleDndConsiderCards(cid: string, e: DndTasksEvent) {
		const colIdx = data.board.columns.findIndex((c) => c.id === cid);
		data.board.columns[colIdx].tasks = e.detail.items;
		data.board.columns = [...data.board.columns];
		prevColumnId = cid;
	}

	async function handleDndFinalizeCards(cid: string, e: DndTasksEvent) {
		const colIdx = data.board.columns.findIndex((c) => c.id === cid);
		data.board.columns[colIdx].tasks = e.detail.items;
		data.board.columns = [...data.board.columns];

		await fetch(`/columns/${cid}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ tasks: data.board.columns[colIdx].tasks.map((c) => c.id) })
		});
		invalidate(`/${data.board.id}`);
	}

	$: createTaskErrors = form?.action === 'createTask' ? form?.errors ?? [] : [];
	$: columnErrors = form?.action === 'column' ? form?.errors ?? [] : [];

	$: editId = $page.url.searchParams.get('edit');
	$: editTask = data.board.columns.flatMap((c) => c.tasks).find((t) => t.id === editId);
	$: if (editId && !editTask) {
		close();
	}

	function close() {
		editId = null;
		goto(`/${data.board.id}`);
	}
</script>

<main class="from-indigo-700 bg-gradient-to-b to-whrit m-0 flex flex-col h-full">
	<h1 class="group items-center flex gap-4 text-4xl font-extrabold text-gray-200 py-2 mx-4 text-sl">
		<a href="/"><Icon src={ArrowLeft} size="30" /></a>
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
		<div
			use:dndzone={{
				items: data.board.columns,
				flipDurationMs,
				type: 'columns'
			}}
			on:consider={handleDndConsiderColumns}
			on:finalize={handleDndFinalizeColumns}
			class="flex gap-2"
		>
			{#each data.board.columns as column (column.id)}
				<ul
					animate:flip={{ duration: flipDurationMs }}
					class="bg-white flex-1 rounded-md p-2 max-w-sm min-w-[22rem] gap-2 flex flex-col"
				>
					<ColumnTitle
						title={column.name}
						on:click={() => {
							deleteResource('columns', column.id);
							data.board.columns = data.board.columns.filter((c) => c.id !== column.id);
						}}
					/>
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
							<a href="?edit={task.id}" animate:flip={{ duration: flipDurationMs }}>
								<Task
									{task}
									on:click={() => {
										deleteResource('tasks', task.id);
										data.board.columns = data.board.columns.map((c) => ({
											...c,
											tasks: c.tasks.filter((t) => t.id !== task.id)
										}));
									}}
								/>
							</a>
						{/each}
					</div>
					<ActionCard
						label="New Task"
						placeholder="Task Name..."
						action="?/createTask&columnId={column.id}"
						errors={form?.columnId === column.id ? createTaskErrors : []}
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
		</div>
		<ul
			class="bg-white rounded-md p-2 flex-1 max-w-xs min-w-[22rem] cursor-default"
			draggable="false"
		>
			<ActionCard
				label="New Column"
				placeholder="Column Name..."
				action="?/createColumn"
				errors={columnErrors}
			/>
		</ul>
	</section>
</main>
{#if !!editTask}
	<div
		role="dialog"
		class="fixed z-40 top-0 bottom-0 right-0 left-0 flex justify-center items-center bg-slate-900/80 backdrop-blur-sm"
		on:click={close}
		on:keydown={(e) => e.key === 'Escape' && close()}
	>
		<div
			class="prose min-w-[14rem] w-[calc(100vw-5%)] rounded-md p-4 bg-indigo-50 flex flex-col"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<h1>Edit <span class="text-indigo-700">{editTask?.name}</span></h1>
			<form
				use:enhance={() => {
					return async () => {
						close();
					};
				}}
				method="POST"
				action="?/editTask&taskId={editId}"
				class="flex flex-col"
			>
				<label class="m-0" for="name"> Name </label>
				<input class="rounded-md" type="text" name="name" bind:value={editTask.name} />
				<label class="mt-4" for="description"> Description </label>
				<textarea class="rounded-md h-40" name="description" bind:value={editTask.description} />
				<button
					class="bg-indigo-700 text-white mt-4 rounded-md w-fit px-14 py-1 ml-auto"
					type="submit">Save</button
				>
			</form>
		</div>
	</div>
{/if}
