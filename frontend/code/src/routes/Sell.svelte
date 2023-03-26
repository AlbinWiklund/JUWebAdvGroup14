<script>
	import { user } from "../user-store.js"

	let name = ""
	let price = 0
	let category = ""
	let description = ""
	let saleCreated = false
	let accountID = $user.accountID
	let errorMessages = []

	async function createSale(){
		const sale = {
			name,
			price,
			category,
			description,
			accountID,
		}

		try {
			const response = await fetch("http://localhost:8080/book/sell", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+$user.accessToken
				},
				body: JSON.stringify(sale)
			})

			errorMessages = []

			switch(response.status){
				case 201:
					saleCreated = true
					break

				case 400:
					errorMessages = await response.json()
					break
			}


		} catch (error) {
			errorMessages.push("COMMUNICATION_ERROR")
			errorMessages = errorMessages
		}
	}

</script>

{#if saleCreated}
	<p>Book listed!</p>
{:else}
	<form on:submit|preventDefault={createSale} class="flex">
		<div class="settings">
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
			<!--<input type="text" name="category" bind:value={category}>-->
			<label for="description">Description</label>
			<textarea name="description" id="" cols="20" rows="10" bind:value={description}></textarea>
			<input type="hidden" bind:value={accountID}>
			<button type="submit" id="submit"> Register book </button>
		</div>
	</form>
	{#if 0 < errorMessages.length}
		<p>We have errors!</p>
		<ul>
			{#each errorMessages as errorMessage}
				<li>{errorMessage}</li>
			{/each}
		</ul>
	{/if}
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