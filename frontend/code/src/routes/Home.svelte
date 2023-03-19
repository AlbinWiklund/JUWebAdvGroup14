<script>
  import { onMount } from "svelte";
	import Card from "../lib/productCard.svelte"

	const fetchAllSales = fetch("http://localhost:8080/allbooks")

	/*let products;

	async function getData(){
		const response = await fetch('../../dummyDataProduct.json');
		const data = await response.json();
		products = data;
	}

	onMount(getData);*/
</script>

<div class="container">
	{#await fetchAllSales}
		<p>Wait, I am loading...</p>
	{:then response}
		{#await response.json() then books}
			{#if books}
				{#each books as book (book.id)}
					<Card bookName={book.name} productId={book.id} accountId={book.accountId}/>
				{/each}
			{/if}
		{/await}
		
	{:catch error}
		<p>Something went wrong, try again later.</p>
	{/await}
</div>

<style>
	.container{
		display: flex;
		flex-wrap: wrap;
	}
</style>