<script lang="ts">
	import '../app.postcss';
	import Header from '../lib/components/Header.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Header session={data.session} />
<main>
	<slot />
</main>
