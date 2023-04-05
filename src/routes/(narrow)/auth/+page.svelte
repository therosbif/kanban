<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { z } from 'zod';

	let email = '';
	let emailErrors: string[] = [];
	let touched = false;

	$: {
		if (!touched) {
			touched = !!email;
		} else {
			const parsedEmail = z.string().email().safeParse(email);
			if (!parsedEmail.success) {
				emailErrors = parsedEmail.error.issues.map((issue) => issue.message);
			} else {
				emailErrors = [];
			}
		}
	}

	function emailLogin(email: string) {
		if (emailErrors.length === 0) {
			signIn('email', { email });
		}
	}
</script>

<svelte:head>
	<title>Sign in</title>
	<meta name="description" content="Sign in to your account" />
</svelte:head>

<div class="w-1/2 m-auto">
	<button
		type="button"
		class="flex mt-44 mx-auto gap-2 w-full items-center justify-center rounded-lg text-gray-600 py-2 px-4 text-center text-base font-semibold bg-gray-50 border border-gray-300 shadow-sm transition duration-100 ease-in hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-200"
		on:click={() => signIn('github')}
	>
		<img src="/github.svg" alt="github logo" />
		Sign in with GitHub
	</button>
	<hr class="border-gray-300 dark:border-gray-700 my-10" />
	<form on:submit|preventDefault={() => emailLogin(email)} class="flex flex-col gap-3">
		<input
			type="email"
			name="email"
			placeholder="Email"
			bind:value={email}
			class="border-none text-lg w-full placeholder:text-gray-400 bg-gray-50 rounded-md py-2 focus:border-indigo-700"
		/>
		{#each emailErrors as error}
			<span
				class="text-sm font-normal bg-amber-400/90 px-2 py-1 rounded-md border border-amber-400 text-amber-800/80"
			>
				{error}
			</span>
		{/each}

		<button
			type="submit"
			class="flex w-full items-center justify-center rounded-lg text-gray-50 py-2 px-4 text-center text-base font-semibold bg-indigo-700 shadow-md transition duration-200 ease-in hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-200 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-slate-700"
			disabled={!!emailErrors.length}
		>
			Sign in with email
		</button>
		<span class="text-center text-sm">
			You will receive a verification email from <a
				href="mailto:kaban-verification@outlook.com"
				class="text-blue-500">kaban-verification@outlook.com</a
			>.
		</span>
	</form>
</div>
