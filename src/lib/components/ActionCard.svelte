<script lang="ts">
	import { Plus } from '@steeze-ui/heroicons';
	import Card from './Card.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { applyAction, enhance } from '$app/forms';
	import type { flattenZodErrors } from '$lib/flattenZodErrors';
	import { invalidateAll } from '$app/navigation';

	let creating = false;

	export let action: string | undefined = undefined;
	export let errors: ReturnType<typeof flattenZodErrors> = [];
	export let label: string;
	export let placeholder: string = label;
	export let extraData: Record<string, string> = {};

	function handleNewColumn() {
		creating = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			creating = false;
		}
	}
</script>

<Card active on:click={handleNewColumn} on:keydown={handleKeydown}>
	<div slot="title" class="flex items-center gap-2">
		<Icon src={Plus} size="20" />
		{#if creating}
			<form
				method="POST"
				{action}
				use:enhance={({ data }) => {
					data = {
						...data,
						...extraData
					};
					return async ({ result }) => {
						console.log('result', result);
						if (result.type === 'success') {
							creating = false;
							console.log('data', data);
							invalidateAll();
						}
						applyAction(result);
					};
				}}
				class="flex flex-col gap-1"
			>
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					name="name"
					{placeholder}
					autofocus
					class="border-none text-lg w-full placeholder:text-gray-300 bg-transparent rounded-md py-0 focus:border-indigo-700"
				/>
				<slot />

				<button type="submit" class="hidden" />

				{#each errors as error}
					<span
						class="text-sm font-normal bg-amber-400/90 px-2 py-1 rounded-md border border-amber-400 text-amber-800/80 ml-3"
					>
						{error.message}
					</span>
				{/each}
			</form>
		{:else}
			<h3>{label}</h3>
		{/if}
	</div>
</Card>
