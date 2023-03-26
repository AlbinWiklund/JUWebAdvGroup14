<script>
	import Card from "../lib/productCard.svelte"

	let fetchSales = fetch("http://localhost:8080/books")

	let category = ""

	async function getBookByCategory(){
		const chosenCategory = {
			category: category,
		}

		fetchSales = fetch("http://localhost:8080/books/bycategory",{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(chosenCategory)
		})
	}

</script>

<h2>Books</h2>
<div>
	<form on:submit|preventDefault={getBookByCategory}>
		<select name="category" bind:value={category}>
			<option value="all">All books</option>
			<option value="math">Math</option>
			<option value="biology">Biology</option>
			<option value="chemistry">Chemistry</option>
			<option value="physics">Physics</option>
			<option value="geografics">Geografics</option>
			<option value="swedish">Swedish</option>
			<option value="english">English</option>
			<option value="programming">Programming</option>
		</select>
		<button type="submit">Search</button>
	</form>
</div>
<div class="container">
	{#await fetchSales}
		<p>Wait, I am loading...</p>
	{:then response}
		{#await response.json() then books}
			{#if books}
				{#each books as book (book.id)}
					<Card bookName={book.name} productId={book.id} accountId={book.accountID}/>
				{/each}
			{:else}
				<p>There are no products yet</p>
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