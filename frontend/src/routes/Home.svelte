<script>
  import { onMount } from "svelte";
	import Card from "../lib/productCard.svelte"

	let products;

	async function getData(){
		const response = await fetch('../../dummyDataBook.json');
		const data = await response.json();
		products = data;
	}

	onMount(getData);
</script>

<div class="container">
	{#if products}
		{#each products as data }	
			<Card bookName={data.title} productId={"hej"} profileId={43}/>
		{/each}
	{/if}
</div>

<style>
	.container{
		display: flex;
		flex-wrap: wrap;
	}
</style>