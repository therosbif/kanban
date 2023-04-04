<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { Session } from '@auth/core/types';
	import { signOut } from '@auth/sveltekit/client';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowRightOnRectangle } from '@steeze-ui/heroicons';

	export let session: Session | null;
</script>

<header class="flex bg-indigo-700 text-slate-50 p-4 items-center">
	<h1 class="text-2xl font-bold">
		<a href="/"> Kanban </a>
	</h1>
	<nav class="ml-auto">
		{#if !!session}
			<button
				on:click={() => {
					signOut();
					invalidateAll();
					goto('/auth');
				}}
				class="ml-9 align-middle"
			>
				<img
					alt="profile"
					src={session.user?.image}
					class="mx-auto h-12 w-12 rounded-lg object-cover"
				/>
				<div
					class="center absolute flex h-12 w-12 -translate-y-full items-center justify-center rounded-lg bg-slate-900 p-2 align-middle opacity-0 transition-opacity hover:opacity-70"
				>
					<Icon src={ArrowRightOnRectangle} size="50" class="stroke-white" />
				</div>
			</button>
		{:else}
			<a href="/auth">Login</a>
		{/if}
	</nav>
</header>
