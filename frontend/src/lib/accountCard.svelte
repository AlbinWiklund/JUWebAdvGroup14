<script>
  import { Link } from "svelte-routing";

  export let username = "Jhon Doe";
  export let rating = "0";
  export let accountId = 0;
  
</script>

<Link to="account/{accountId}">
  <div class="card">
    <div id="username" class="textInBoxes"> {username} </div>
    <div id="rating" class="textInBoxes"> {rating}/5 </div>
  </div>
</Link>

<style>
  .card{
		width: 300px;
		height: 50px;
		border: 3px solid black;
		padding: 0;
    margin: 10px;
		border-radius: 2px;
		display: grid;
		background-color: white;
		grid-template-columns: 4fr 1fr;
  	grid-template-rows: 1fr;
		grid-template-areas: 
		"username rating"
  }
	
	.textInBoxes{
		display: flex;
		align-items: center;
		justify-content: center;
		color: black;
	}

  #rating{
    border-left: 2px solid black;
  }
</style>