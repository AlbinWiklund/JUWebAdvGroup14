<script>
	import { Link } from "svelte-routing";
	import { user } from "../user-store.js"
	
	export let accountId;

	const fetchAccountPromise = fetch("http://localhost:8080/allusers/"+accountId)
</script>


{#await fetchAccountPromise}
	<p>Wait, I am loading...</p>
{:then response}
{#await response.json() then account}
		{#if account}
			<div id="grid">
				<div id="about">
					{#each account as acc (account.id)}
						<div id="profilePic"> Jo </div>
						<div id="name">{acc.username}</div>
						<div id="rating">Rating: {acc.rating}</div>
					{/each}
				</div>
				<div id="other">
					<div id="listing">
						<h2>
							Product Listing
						</h2>
							{#each account as book (account.bookID)}
								<Link to="/book/{book.bookID}">
									<div class="listingItem">
										{book.bookTitle}
									</div>
								</Link>
							{/each}
					</div>
					<div id="review">
						<h2>
							Reviews
						</h2>
							{#each account as review (account.reviewID)}
								<Link to="/book/{review.bookId}">
									<div class="reviewItem">
										{review.reviewDescription}
									</div>
								</Link>
							{/each}
					</div>
				</div>
			</div>
			{#if $user.accountID == account[0].id}
				<button>Delete this account</button>
			{/if}
		{/if}
		
	{/await}

{:catch error}
	<p>Something whent wrong, try again later.</p>
{/await}

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
		border: 2px solid black;
		padding: 5px;
		margin: 10px;
		background-color: beige;
	}

	.listingItem{
		border: 2px solid black;
		padding: 5px;
		margin: 10px;
		background-color: beige;
	}
</style>