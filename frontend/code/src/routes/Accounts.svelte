<script>
	import Card from "../lib/accountCard.svelte"

	const fetchAccountsPromise = fetch("http://localhost:8080/allusers")

</script>

<div class="container">
	{#await fetchAccountsPromise}
		<p>Wait, I am loading...</p>
	{:then response}
		{#await response.json() then accounts}
			{#if accounts}
				{#each accounts as account (account.id)}
					<Card username={account.username} rating={account.rating} accountId={account.id}/>
				{/each}
			{/if}
		{/await}

	{:catch error}
		<p>Something whent wrong, try again later.</p>
	{/await}
</div>


<style>
	.container{
		display: flex;
		flex-wrap: wrap;
	}
</style>