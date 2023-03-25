<script>
  import { Link } from "svelte-routing"

  export let username = "Jhon Doe"
  export let accountId = 0
  
</script>

<Link to="/account/{accountId}">
  <div class="card">
    {username}
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
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
  }
</style>