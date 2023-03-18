<script>
	import { Link } from "svelte-routing";

	export let productId;
</script>

<form action="" id="flex">
	<input type="hidden" value="{productId}">
	<label for="review"> <h2>Write what your review of the book or the seller</h2> </label>
	<textarea name="review" id="review" cols="30" rows="10" placeholder="Write here"></textarea>
	<Link to="/">
		<button id="button">Submit your review</button>
	</Link>
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