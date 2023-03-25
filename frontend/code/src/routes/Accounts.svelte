<script>
	import Card from "../lib/accountCard.svelte"
	import { user } from "../user-store.js"

	const fetchAccountsPromise = fetch("http://localhost:8080/allusers")

</script>

<h2>Accounts</h2>
<div class="container">
	{#await fetchAccountsPromise}
		<p>Wait, I am loading...</p>
	{:then response}
		{#await response.json() then accounts}
			{#if accounts}
				{#each accounts as account (account.id)}
					{#if $user.accountID != account.id}
						<Card username={account.username} rating={account.rating} accountId={account.id}/>
					{/if}
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