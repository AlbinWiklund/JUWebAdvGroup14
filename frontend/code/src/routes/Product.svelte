<script>
	import { Link } from "svelte-routing"
	import { user } from "../user-store.js"
	import Modal from "../lib/deleteModal.svelte"

	export let productId;
	
	const fetchProductPromise = fetch("http://localhost:8080/books/"+productId)

	let deleteInProgress
	let modalOpen = false
	let bookDeleted = false

	
	const openModal = () => {
		modalOpen = true;
	}
	
	const closeModal = () => {
		modalOpen = false
		deleteInProgress = null
	}
	
	async function deleteBook () {
		const response = await fetch("http://localhost:8080/book/"+productId+"/delete", {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer "+$user.accessToken
				}
			})
		
		switch(response.status){
			case 200:
				bookDeleted = true
				break
			case 401:
				alert("Unauthorized")
				break
			case 500:
				alert("Server error, can not delete book at this moment")
				break
		}
	}
</script>

{#if bookDeleted}
	<p>Book has been deleted</p>
{:else}
	{#await fetchProductPromise}
		<p>Wait, I am loading...</p>
	{:then response}
		{#await response.json() then books}
			{#if books}
				{#each books as book (book.id)}
					<div id="grid">
						<div id="bookPicture">
							<img src="https://www.pngkey.com/png/detail/350-3500680_placeholder-open-book-silhouette-vector.png" alt="book">
						</div>
						
						<div class="flex" id="title">
							<h2>
								{book.name}
							</h2>
						</div>
						
						<div class="flex" id="price">
							{book.price} SEK
						</div>
						
						<div class="flex" id="category">
							{book.category}
						</div>

						<div class="flex" id="description">
							{book.description}
						</div>
						<div id="btn">
							{#if book.accountID == $user.accountID}
								<button on:click={openModal} class="deleteBtn">
									Delete book
								</button>
								<Link to="/book/{productId}/update">
									<button>
										Update Book
									</button>
								</Link>
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
										<p>Are you sure you want to delete this book?</p>
										<button on:click={deleteBook}>yes</button>
										<button on:click={closeModal}>no</button>
									{/if}
								</Modal>

							{:else}
								{#if $user.isLoggedIn}
									<Link to="/book/{productId}/review">
										<button>
											Buy Book
										</button>
									</Link>
								{/if}
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		{/await}
		{:catch error}
			<p>Something went wrong, try again later.</p>
	{/await}
{/if}

<style>
	img{
		display: block;
		margin-left: auto;
		margin-right: auto;
		height: 200px;
		border-top: 2px solid black;
		border-left: 2px solid black;
		border-right: 2px solid black;
	}

	#grid{
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 200px 1fr 40px 1fr 1fr;
		grid-template-areas: 
		"bookPicture bookPicture"
		"title price"
		"category category"
		"description description"
		"buy nothing";
	}

	#bookPicture{
		grid-area: bookPicture;
	}

	#title{
		grid-area: title;
		border: 2px solid black;
	}

	#price{
		grid-area: price;
		border-top: 2px solid black;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
	}

	#category{
		grid-area: category;
		border-left: 2px solid black;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
	}

	#description{
		grid-area: description;
		border-left: 2px solid black;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
	}

	#btn{
		grid-area: buy;
		margin: 10px;
	}

	.flex{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>