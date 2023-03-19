<script>
	import { Link } from "svelte-routing"; 
</script>

<form action="" method="post" class="flex">
	<div class="settings">
		<label for="title">Title of the book</label>
		<input type="text" name="title">
		<label for="price">Price in SEK</label>
		<input type="number" name="price">
		<label for="category">Category</label>
		<input type="text" name="category">
		<label for="description">Description</label>
		<textarea name="description" id="" cols="20" rows="10"></textarea>
		<Link to="/">
			<button type="submit" id="submit"> Register book </button>
		</Link>
	</div>
</form>

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