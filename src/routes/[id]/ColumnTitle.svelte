<script lang="ts">
	import { Trash } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let title: string;
</script>

<h2 class="group flex justify-between text-2xl font-bold text-indigo-700 mt-0">
	{title}
	<button on:click class="group-hover:block hidden">
		<Icon src={Trash} size="16" class="stroke-rose-500" />
	</button>
</h2>
