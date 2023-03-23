<script>
	import { onMount } from "svelte";
	import { Link } from "svelte-routing";

	export let productId;
	
	const fetchProductPromise = fetch("http://localhost:8080/allbooks/"+productId)

	let productDeleted = false
	let name = ""
	let price = 0
	let category = ""
	let description = ""

	let deleteProductBool = false
	let updateProductBool = false

	async function deleteProduct(){

		const productToDelete={
			productId,
		}

		try {
			const response = await fetch("http://localhost:8080/allbooks/"+productId+"/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productToDelete)
			})

			switch(response.status){
				case 201:
					productDeleted = true
				break;

				case 400:

				break;
			}
		} catch (error) {
			
		}
	}

	async function updateProduct(){
		 const productToUpdate={
			productId,
			name,
			price,
			category,
			description,
		 }

		const response = await fetch("http://localhost:8080/allbooks/"+productId+"/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(productToUpdate)
		})
/*
		switch(response.status){
			case 201:

			break;

			case 400:

			break;
		}*/
	}

	/*let book;

	async function getData(){
		const response = await fetch('../../dummyDataProduct.json');
		const data = await response.json();
		
		getProductFromData(data);
	}

	async function getProductFromData(proData){
		for (const element of proData){
			if (element.id == productId) {
				book = element;
			}
		}
	}

	onMount(getData);*/
</script>


{#await fetchProductPromise}
	<p>Wait, I am loading...</p>
{:then response}
<div>
	Tjena
</div>
	{#await response.json() then books}
		{#if books}
			{#each books as book (book.id)}
				<div id="grid">
					<div id="bookPicture">
						{book.id}
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
					<div id="buy">
						<Link to="/book/{productId}/review">
							<button>
								Buy Book
							</button>
						</Link>
						<button on:click|preventDefault={updateProduct}>
							Update Book
						</button>
						{#if updateProductBool}
							<p></p>
						{/if}
						<button on:click|preventDefault={deleteProduct}>
							Delete Book
						</button>
						{#if deleteProductBool}
							<p></p>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	{/await}
	{:catch error}
		<p>Something went wrong, try again later.</p>
{/await}

<style>
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

	#buy{
		grid-area: buy;
		margin: 10px;
	}

	.flex{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>