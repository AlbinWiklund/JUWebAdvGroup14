<script>
	import Card from "../lib/accountCard.svelte"
	import { onMount } from "svelte";

	let accounts;

	async function getData(){
		const response = await fetch('../../dummyDataAccounts.json');
		const data = await response.json();
		accounts = data;
	}

	onMount(getData);
</script>

<div class="container">
	{#if accounts}
		{#each accounts as account}
			<Card username={account.username} rating={account.rating}/>
		{/each}
	{/if}
</div>


<style>
	.container{
		display: flex;
		flex-wrap: wrap;
	}
</style>