<script>
	import { Link } from "svelte-routing";
	import { user } from "../user-store.js"

	let name = ""
	let price = 0
	let category = ""
	let description = ""
	let saleCreated = false
	let accountID = 1
	let errorCodes = []

	async function createSale(){
		const sale = {
			name,
			price,
			category,
			description,
			accountID,
		}
		console.log(name)
		try {
			console.log(price)
			const response = await fetch("http://localhost:8080/sellbook", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+$user.accessToken
				},
				body: JSON.stringify(sale)
			})

			switch(response.status){
				case 201:
					saleCreated = true
				break

				case 400:
					errorCodes = await response.json()
				break
			}


		} catch (error) {
			errorCodes.push("COMMUNICATION_ERROR")
			errorCodes = errorCodes
		}
	}

</script>

{#if saleCreated}
	<p>Sale created!</p>
{:else}
	<form on:submit|preventDefault={createSale} class="flex">
		<div class="settings">
			<label for="title">Title of the book</label>
			<input type="text" name="title" bind:value={name}>
			<label for="price">Price in SEK</label>
			<input type="number" name="price" bind:value={price}>
			<label for="category">Category</label>
			<input type="text" name="category" bind:value={category}>
			<label for="description">Description</label>
			<textarea name="description" id="" cols="20" rows="10" bind:value={description}></textarea>
			<input type="text" bind:value={accountID}>
			<button type="submit" id="submit"> Register book </button>
		</div>
	</form>
{/if}

<style>
	.flex{
		display: flex;
		flex-direction: column;
	}

	div.settings {
    display:grid;
	}
	div.settings label { 
		text-align:left;
		margin-top: 10px; 
	}

	div.settings label:after { 
		content: ":"; 
	}

	div.settings input {
		max-width: 300px;
	}

	button {
		margin-top: 10px;
	}
</style>