<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<svelte:head>
	<title>Sign in</title>
	<meta name="description" content="Sign in to your account" />
</svelte:head>

<div class="w-1/2 m-auto">
	<button
		type="button"
		class="flex my-44 mx-auto gap-2 w-full items-center justify-center rounded-lg text-gray-600 py-2 px-4 text-center text-base font-semibold bg-gray-50 border border-gray-300 shadow-sm transition duration-100 ease-in hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-200"
		on:click={() => signIn('github')}
	>
		<img src="/github.svg" alt="github logo" />
		Sign in with GitHub
	</button>
</div>
