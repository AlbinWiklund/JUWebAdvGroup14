<script>
	import { Link } from "svelte-routing"
	import { user } from "../user-store.js"
	import Modal from "../lib/deleteModal.svelte"

	export let accountId;

	let deleteInProgress
	let modalOpen = false
	let accountDeleted = false
	
	const fetchAccountPromise = fetch("http://localhost:8080/allusers/"+accountId)
	
	const openModal = () => {
		modalOpen = true;
	}
	
	const closeModal = () => {
		modalOpen = false
		deleteInProgress = null
	}
	
	async function deleteAccount () {
		const response = await fetch("http://localhost:8080/allusers/"+$user.accountID+"/delete", {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer "+$user.accessToken
				}
			})
		
		switch(response.status){
			case 200:
				accountDeleted = true
				$user.isLoggedIn = false
				$user.accessToken = ""
				$user.accountID = 0
				break
			case 500:
				alert("Account failed to delete")
				break
		}
	}
</script>

{#if accountDeleted}
	<p>Account was delted.</p>
{:else}
	{#await fetchAccountPromise}
		<p>Wait, I am loading...</p>
	{:then response}
	{#await response.json() then account}
			{#if account}
				<div id="grid">
					<div id="about">
						{#each account[0] as acc}
							<div id="profilePic"> <img src="/profile-picture.jpeg" alt="profile"> </div>
							<div id="name">{acc.username}</div>
							{#if account[3][0].accRating == null}
								<div id="rating">Rating: 0/5</div>
							{:else}
								<div id="rating">Rating: {account[3][0].accRating}/5</div>
							{/if}
						{/each}
					</div>
					<div id="other">
						<div id="listing">
							<h2>
								Product Listing
							</h2>
								{#each account[1] as book}
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
								{#each account[2] as review}
									<div class="reviewItem">
										{review.reviewDescription}
									</div>
									{#if review.reviewerID == $user.accountID}
										<Link to="/review/{review.reviewID}/update">
											<button>Update</button>
										</Link>
										<Link to="/review/{review.reviewID}/delete">
											<button class="deleteBtn">Delete</button>
										</Link>
									{/if}
								{/each}
						</div>
					</div>
				</div>
				{#if $user.accountID == account[0][0].id}
					<button on:click={openModal} class="deleteBtn" id="deleteBtn">Delete this account</button>
					<!-- Modal taken from  https://svelte.dev/repl/0299705b5e9e46be9e87fe4fef035bec?version=3.32.1-->
					<Modal visible={modalOpen}>
						{#if deleteInProgress}
							{#await deleteInProgress then result}
								<p>Thing deleted ({JSON.stringify(result)}).</p>
								<button on:click={closeModal}>ok</button>
							{:catch err}
								<p>Could not delete the thing.</p>
								<button on:click={closeModal}>ok</button>
							{/await}
						{:else}
							<p>Are you sure you want to delete your account?</p>
							<button on:click={deleteAccount}>yes</button>
							<button on:click={closeModal}>no</button>
						{/if}
					</Modal>
					<Link to="/account/{accountId}/update">
						<button>Update Account</button>
					</Link>
				{/if}
			{/if}
			
		{/await}

	{:catch error}
		<p>Something whent wrong, try again later.</p>
	{/await}
{/if}

<style>
	img{
		display: block;
		margin-left: auto;
		margin-right: auto;
		max-width: 350px;
		min-width: 350px;
		max-height: 350px;
		min-height: 350px;
		border-left: 2px solid black;
		border-right: 2px solid black;
	}

	#deleteBtn{
		margin-top: 10px;
	}

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
		grid-template-rows: 350px 50px;
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
		align-items: center;
		border-top: 2px solid black;
		border-right: 2px solid black;
	}

	#rating{
		grid-area: rating;
		display: grid;
		justify-content: center;
		align-items: center;
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
		color: black;
	}

	.listingItem{
		border: 2px solid black;
		padding: 5px;
		margin: 10px;
		background-color: beige;
	}
</style>