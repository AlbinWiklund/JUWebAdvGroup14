<script>
	import { Router, Link, Route } from "svelte-routing";
	import { user } from "./user-store.js"
	// import { jwt_decode } from "jwt-decode"

	import Home from "./routes/Home.svelte"
	import About from "./routes/About.svelte"
	import Accounts from "./routes/Accounts.svelte"
	import Sell from "./routes/Sell.svelte"
	import SignIn from "./routes/Sign-in.svelte"
	import SignUp from "./routes/Sign-up.svelte"
	import Product from "./routes/Product.svelte"
	import Account from "./routes/Account.svelte"
	import Review from "./routes/Review.svelte"
	import UpdateReview from "./routes/Review-update.svelte"
	import UpdateAccount from "./routes/Account-update.svelte"

	export let url = "";

	function signOut(){
		$user.isLoggedIn = false
		$user.accessToken = ""
		$user.accountID = 0
	}
</script>
<Router {url} >
	<header id="title"><em>Kunskapsmagasinet</em></header>

	<nav id="menu">
		<ul id="sidebar">
			<li><Link to="/">Home</Link></li>
			<li><Link to="/accounts">Accounts</Link></li>
			<li><Link to="/about">About</Link></li>
			{#if $user.isLoggedIn == false}
				<li><button id="sign-in"><Link to="/signin">Sign In</Link></button></li>
				<li><button id="sign-up"><Link to="/signup">Sign Up</Link></button></li>
			{:else if $user.isLoggedIn == true}
				<li><Link to="/sell">Sell</Link></li>
				<li><Link to="/account/{$user.accountID}">Profile</Link></li>
				<li><button id="sign-up" on:click={signOut}><Link to="/">Sign out</Link></button></li>
			{/if}
		</ul>
	</nav>

	<main id="main">
		<Route path="/"><Home /></Route>
		<Route path="/about" component={About} />
		<Route path="/accounts" component={Accounts} />
		<Route path="/sell" component={Sell} />
		<Route path="/signup" component={SignUp} />
		<Route path="/signin" component={SignIn} />
		<Route path="/product" component={Product} />
		<Route path="/account/:accountId" component={Account} />
		<Route path="/account/:accountId/update" component={UpdateAccount} />
		<Route path="/book/:productId" component={Product} />
		<Route path="/book/:productId/review" component={Review} />
		<Route path="/review/:reviewId/update" component={UpdateReview} />
	</main>
</Router>

<style>
	:global(body) {
		background-color: rgb(139, 75, 1);
	}

	#sidebar{
		list-style-type: none;
		margin-left: 0;
		background-color: bisque;
		height: 100%;
		padding: 10px;
	}

	#sidebar > *{
		padding: 10px;
		margin-top: 20px;
		margin-bottom: 20px;
		font-weight: bold;
	}

	#sign-in{
		background-color: rgb(139, 75, 1);
		color: white;
	}

	#sign-up{
		background-color: rgb(200, 120, 0);
	}

	#title{
		display: flex;
		grid-area: top;
		position: fixed;
		width: 100%;
		justify-content: center;
	}

	#menu{
		grid-area: nav;
		position: fixed;
		margin-top: 105px;
	}

	#main{
		grid-area: main;
		padding: 10px;
		margin: 15px;
	}
</style>
