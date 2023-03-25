<script>
	import { Link } from "svelte-routing";
	import { user } from "../user-store.js"

	export let productId;

	let review = ""
	let rating = 0
	let reviewerId = $user.accountID

	let reviewWasCreated = false
	let errorMessages = []

	async function createReview(){
		const comment = {
			review,
			rating,
			reviewerId,
		}

		try {
			const response = await fetch("http://localhost:8080/allbooks/"+productId+"/review", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+$user.accessToken
				},
				body: JSON.stringify(comment),
			})

			errorMessages = []

			switch(response.status){
				case 201:
					reviewWasCreated = true
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
{#if reviewWasCreated}
	<p>Review was created!</p>
{:else}
	<form on:submit|preventDefault={createReview} id="flex">
		<input type="hidden" value="{productId}">
		<label for="review"> <h2>Write what your review of the book or the seller</h2> </label>
		<textarea name="review" id="review" cols="30" rows="10" placeholder="Write here" bind:value={review}></textarea>
		<label for="rating">Rating</label>
		<select name="rating" bind:value={rating}>
			<option value=1>1</option>
			<option value=2>2</option>
			<option value=3>3</option>
			<option value=4>4</option>
			<option value=5>5</option>
		</select>
		<button type="submit" id="button">Submit your review</button>
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
	#flex{
		display: flex;
		flex-direction: column;
	}
	#button{
		display: inline-block;
		max-width: auto;
	}
</style>