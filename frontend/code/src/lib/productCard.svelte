<script>
  import { Link } from "svelte-routing"
  
  export let bookName
  export let productId
  export let accountId
</script>

<div class="card">
  <div id="cardPicture">
		<img src="https://www.pngkey.com/png/detail/350-3500680_placeholder-open-book-silhouette-vector.png" alt="book">
	</div>	
  <div id="bookTitle" class="textInBoxes"> {bookName}</div>
  <div id="productLink" class="textInBoxes"> <Link to="/account/{accountId}"> Profile </Link></div>
  <div id="profileLink" class="textInBoxes"> <Link to="/book/{productId}"> Book </Link> </div>
</div>


<style>
	img{
		width: 200px;
		height: 130px;
	}

  .card{
		width: 200px;
		height: 350px;
		border: 3px solid black;
		padding: 0;
		margin: 10px;
		box-shadow: 5px 10px black;
		border-radius: 2px;
		display: grid;
		background-color: white;
		grid-template-columns: 1fr 1fr;
  	grid-template-rows: 8fr 3fr 2fr;
		grid-template-areas: 
		"pic pic"
		"title title"
		"product profile"
  }
	
	.textInBoxes{
		display: flex;
		align-items: center;
		justify-content: center;
		color: black;
	}

	#cardPicture{
		grid-area: pic;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#bookTitle{
		grid-area: title;
		border-top: 2px solid black;
	}

	#productLink{
		grid-area: product;
		border-top: 2px solid black;
		border-right: 2px solid black;
	}

	#profileLink{
		grid-area: profile;
		border-top: 2px solid black;
	}
</style>