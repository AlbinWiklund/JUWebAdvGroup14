<script>
  import { onMount } from "svelte";
	import Card from "../lib/productCard.svelte"

	let products;

	async function getData(){
		const response = await fetch('../../dummyDataProduct.json');
		const data = await response.json();
		products = data;
	}

	onMount(getData);
</script>

<div class="container">
	{#if products}
		{#each products as product }	
			<Card bookName={product.title} productId={product.id} accountId={product.accountId}/>
		{/each}
	{/if}
</div>

<style>
	.container{
		display: flex;
		flex-wrap: wrap;
	}
</style>