<script>
	import { onMount } from "svelte";
	import { Link } from "svelte-routing";

	export let productId;

	let book;

	async function getData(){
		const response = await fetch('../../dummyDataProduct.json');
		const data = await response.json();
		
		getProductFromData(data);
	}

	async function getProductFromData(proData){
		for (const element of proData){
			if (element.id == productId) {
				book = element;
			}
		}
	}

	onMount(getData);
</script>
{#if book}
	<div id="grid">
		<div id="bookPicture">
			{book.id}
		</div>
		
		<div class="flex" id="title">
			<h2>
				{book.title}
			</h2>
		</div>
		
		<div class="flex" id="price">
			{book.price} SEK
		</div>
		
		<div class="flex" id="category">
			{book.category}
		</div>

		<div class="flex" id="description">
			{book.description}
		</div>
		<div id="buy">
			<Link to="book/{productId}/review">
				<button>
					Buy Book
				</button>
			</Link>
		</div>
	</div>
{/if}

<style>
	#grid{
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 200px 1fr 40px 1fr 1fr;
		grid-template-areas: 
		"bookPicture bookPicture"
		"title price"
		"category category"
		"description description"
		"buy nothing";
	}

	#bookPicture{
		grid-area: bookPicture;
	}

	#title{
		grid-area: title;
		border: 2px solid black;
	}

	#price{
		grid-area: price;
		border-top: 2px solid black;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
	}

	#category{
		grid-area: category;
		border-left: 2px solid black;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
	}

	#description{
		grid-area: description;
		border-left: 2px solid black;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
	}

	#buy{
		grid-area: buy;
		margin: 10px;
	}

	.flex{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>