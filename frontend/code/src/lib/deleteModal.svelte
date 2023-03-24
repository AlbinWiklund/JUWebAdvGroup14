<script>
	import { fly, fade } from 'svelte/transition'
	export let visible = false;
</script>

{#if visible}
<div class="modal" transition:fly={{ y: -200, duration: 300 }}>
	<slot />
</div>
<div class="overlay" transition:fade={{ duration: 200 }}></div>
{/if}


<style>
	.modal {
		width: 480px;
		min-height: 80px;
		padding: 24px;
		background: rgb(139, 75, 1);
		z-index: 3;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 6px;
	}
	.overlay {
		position: fixed;
		top :0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 2;
	}

</style>