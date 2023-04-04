<script lang="ts">
	export let href: string | null | undefined = undefined;

	export let active = false;
</script>

<li
	class="shadow-md rounded-lg p-4 border border-indigo-200 {active
		? 'bg-indigo-600 text-white'
		: ''}"
	on:click
	on:keydown
>
	<a {href}>
		<header class="text-lg font-semibold">
			<slot name="title" />
		</header>
		<slot />
		<footer>
			<slot name="footer" />
		</footer>
	</a>
</li>
