<script>
	import { Link } from "svelte-routing";

	export let productId;

	let review = ""
	let rating = 0
	let reviewWasCreated = false
	let errorCodes = []

	async function createReview(){
		const comment = {
			review,
			rating,
		}

		try {
			const response = await fetch("http://localhost:8080/allbooks/"+productId+"/review", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(comment),
			})

			switch(response.status){
				case 201:
					reviewWasCreated = true
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

<form on:submit|preventDefault={createReview} id="flex">
	<input type="hidden" value="{productId}">
	<label for="review"> <h2>Write what your review of the book or the seller</h2> </label>
	<textarea name="review" id="review" cols="30" rows="10" placeholder="Write here" bind:value={review}></textarea>
	<label for="rating">Rating</label>
	<select name="rating" bind:value={rating}>
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
	</select>
	<!--<input type="number" name="rating" bind:value={rating}>-->
	<button type="submit" id="button">Submit your review</button>
</form>

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