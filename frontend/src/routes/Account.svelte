<script>
	import { Link } from "svelte-routing";
	import { onMount } from "svelte";
	
	export let accountId;

	let account;
	let books = [];
	let reviews = [];

	async function getData(){
		const accResponse = await fetch('../../dummyDataAccounts.json');
		const accData = await accResponse.json();

		const proResponse = await fetch('../../dummyDataProduct.json');
		const proData = await proResponse.json();

		const revResponse = await fetch('../../dummyDataReviews.json');
		const revData = await revResponse.json();
		
		getAccountFromData(accData);
		getProductsFromAll(proData);
		getReviewsFromAll(revData);
	}

	async function getAccountFromData(accounts){
		for (const element of accounts){
			if (element.id == accountId) {
				account = element;
			}
		}
	}

	async function getProductsFromAll(allProducts){
		for (const element of allProducts){
			if (element.accountId == accountId) {
				books.push(element);
			}
		}
	}

	async function getReviewsFromAll(allReviews){
		for (const element of allReviews){
			if (element.bookSellerId == accountId) {
				reviews.push(element);
			}
		}
	}

	onMount(getData);
</script>

{#if account}
	<div id="grid">
		<div id="about">
			<div id="profilePic">{account.id}</div>
			<div id="name">{account.username}</div>
			<div id="rating">Rating: {account.rating}</div>
		</div>
		<div id="other">
			<div id="listing">
				<h2>
					Product Listing
				</h2>
				{#if books}
					{#each books as book}
					<Link to="/book/{book.id}">
						<div class="listingItem">
							{book.title}
						</div>
					</Link>
					{/each}
				{/if}
			</div>
			<div id="review">
				<h2>
					Reviews
				</h2>
				{#if reviews}
					{#each reviews as review}
						<Link to="/book/{review.productId}">
							<div class="reviewItem">
								{review.description}
							</div>
						</Link>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}


<style>
	#grid{
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
		grid-template-areas: 
		"about"
		"other";
		border: 2px solid black;
	}

	#about{
		grid-area: about;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto 30px;
		grid-template-areas: 
		"profilePic profilePic"
		"name rating";
		height: 400px;
	}

	#other{
		grid-area: other;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: 
		"listing review";
		max-height: 600px;
	}

	#profilePic{
		grid-area: profilePic;
	}

	#name{
		grid-area: name;
		display: grid;
		justify-content: center;
		border-top: 2px solid black;
		border-right: 2px solid black;
	}

	#rating{
		grid-area: rating;
		display: grid;
		justify-content: center;
		border-top: 2px solid black;
	}

	#description{
		grid-area: description;
		border-top: 2px solid black;
		background-color: beige;
		color: black;
		padding: 8px;
	}

	#listing{
		grid-area: listing;
		border-top: 2px solid black;
		border-right: 2px solid black;
		padding: 8px;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		overflow: auto;
	}

	#review{
		grid-area: review;
		border-top: 2px solid black;
		padding: 8px;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		overflow: auto;
	}

	.reviewItem{
		display: flex;
		flex-direction: column;
		border: 2px solid black;
		padding: 5px;
		margin: 10px;
		width: fit-content;
		background-color: beige;
	}

	.listingItem{
		border: 2px solid black;
		padding: 5px;
		margin: 10px;
		width: fit-content;
		background-color: beige;
	}
</style>