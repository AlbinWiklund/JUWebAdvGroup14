<script>
	import { Link } from "svelte-routing"
	import { user } from "../user-store.js"

	export let reviewId

	let reviewWasDeleted = false

	async function deleteReview(){
		const response = await fetch("http://localhost:8080/review/"+reviewId+"/delete", {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer "+$user.accessToken
				}
			})
		switch(response.status){
			case 200:
				reviewWasDeleted = true
				break

			case 500:
				alert("Review failed to delete")
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