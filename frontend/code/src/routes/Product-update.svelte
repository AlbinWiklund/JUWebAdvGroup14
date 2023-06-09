<script>

	import { user } from "../user-store.js"

	export let productId

	const BACKEND_URL = "http://localhost:8080/"

	let name = ""
	let price = 0
	let category = ""
	let description = ""
	let accountId = 0
	let bookWasUpdated = false
	let errorMessages = []

	async function getBook(){

		const response = await fetch(BACKEND_URL+"books/"+productId)

		switch(response.status){
			case 200:
				const books = await response.json()
				const book = books[0]
				name = book.name
				price = book.price
				category = book.category
				description = book.description
				accountId = book.accountID
				break
				
			case 400:
				errorMessages = await response.json()
				break

			case 500:
				errorMessages = await response.json()
				break
		}

	}

	getBook()

	async function updateBook(){
		const book = {
			accountId,
			name,
			price,
			category,
			description,
		}

		try {
			const response = await fetch(BACKEND_URL+"book/"+productId,{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+$user.accessToken
				},
				body: JSON.stringify(book),
			})

			errorMessages = []

			switch(response.status){
				case 200:
					bookWasUpdated = true
					break

				case 400:
					errorMessages = await response.json()
					break

				case 401:
					errorMessages = ["Unauthorized"]
					break
			}

		} catch (error) {
			errorMessages.push("COMMUNICATION_ERROR")
			errorMessages = errorMessages
		}
	}

</script>


<h1>Update book info</h1>

<form on:submit|preventDefault={updateBook} id="flex">
	<label for="title">Title of the book</label>
	<input type="text" name="title" bind:value={name}>
	<label for="price">Price in SEK</label>
	<input type="number" name="price" bind:value={price}>
	<label for="category">Category</label>
	<select name="category" bind:value={category}>
		<option value="math">Math</option>
		<option value="biology">Biology</option>
		<option value="chemistry">Chemistry</option>
		<option value="physics">Physics</option>
		<option value="geografics">Geografics</option>
		<option value="swedish">Swedish</option>
		<option value="english">English</option>
		<option value="programming">Programming</option>
	</select>
	<label for="description">Description</label>
	<textarea name="description" id="" cols="20" rows="10" bind:value={description}></textarea>
	<button type="submit" id="submit"> Register book </button>
</form>
{#if 0 < errorMessages.length}
	<p>We have errors!</p>
	<ul>
		{#each errorMessages as errorMessage}
			<li>{errorMessage}</li>
		{/each}
	</ul>
{/if}
{#if bookWasUpdated}
	<p>Account updated!</p>
{/if}

<style>
	#flex {
		display: flex;
		flex-direction: column;
	}

	input {
		margin-bottom: 10px;
	}

	button {
		width: fit-content;
	}
</style>