<script>
	import { Link } from "svelte-routing";
	import { user } from "../user-store.js"

	export let reviewId;

	let review = ""
	let rating = 0
	let reviewerId = 0

	let reviewWasUpdated = false
	let errorMessages = []

	async function getReview(){
		const response = await fetch("http://localhost:8080/review/"+reviewId)

		switch (response.status){
			case 200:
				const oldReview = await response.json()
				review = oldReview[0].review
				rating = oldReview[0].rating
				reviewerId = oldReview[0].reviewerID
				break
			case 500:
				errorMessages = await response.json()
				break
		}
	}

	getReview()

	async function updateReview(){
		const comment = {
			review,
			rating,
			reviewerId,
		}

		errorMessages = []

		try {
			const response = await fetch("http://localhost:8080/review/"+reviewId+"/update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+$user.accessToken
				},
				body: JSON.stringify(comment),
			})

			errorMessages = []

			switch(response.status){
				case 200:
					reviewWasUpdated = true
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
{#if reviewerId == $user.accountID}
	<form on:submit|preventDefault={updateReview} id="flex">
		<input type="hidden" value="{reviewId}">
		<label for="review"> <h2>Write your review of the book or the seller</h2> </label>
		<textarea name="review" id="review" cols="30" rows="10" placeholder="Write here" bind:value={review}></textarea>
		<label for="rating">Rating</label>
		<select name="rating" bind:value={rating}>
			<option value=1>1</option>
			<option value=2>2</option>
			<option value=3>3</option>
			<option value=4>4</option>
			<option value=5>5</option>
		</select>
		<button type="submit" id="button">Update your review</button>
	</form>
	{#if 0 < errorMessages.length}
		<p>We have errors!</p>
		<ul>
			{#each errorMessages as errorMessage}
				<li>{errorMessage}</li>
			{/each}
		</ul>
	{/if}
	{#if reviewWasUpdated}
	<p>Review was updated!</p>
	{/if}
{:else}
	<p>You do not have access to this review!</p>
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