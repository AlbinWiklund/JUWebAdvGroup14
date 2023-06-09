<script>
	import { Link } from "svelte-routing"
	import { user } from "../user-store.js"

	export let reviewId

	let reviewWasDeleted = false

	const BACKEND_URL = "http://localhost:8080/"

	async function deleteReview(){
		const response = await fetch(BACKEND_URL+"review/"+reviewId, {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer "+$user.accessToken
				}
			})
		switch(response.status){
			case 200:
				reviewWasDeleted = true
				break

			case 401:
				alert("Unauthorized")
				break

			case 500:
				alert("Server error, review failed to delete")
				break
		}
	}
</script>

{#if reviewWasDeleted}
	<p>Review deleted!</p>
{:else}
	<h2> Are you sure you want to delete this review? </h2>
	<button class="deleteBtn" on:click={deleteReview}> Delete review</button>
	<Link to="/">
		<button> No </button>
	</Link>
{/if}