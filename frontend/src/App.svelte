<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import About from "./routes/About.svelte";
	import Accounts from "./routes/Accounts.svelte";
	import Profile from "./routes/Profile.svelte";
	import Sell from "./routes/Sell.svelte";
	import SignIn from "./routes/Sign-in.svelte";
	import SignUp from "./routes/Sign-up.svelte";

	export let url = "";
</script>
<h1><em>Kunskapsmagasinet</em></h1>
<Router {url}>
	<nav>
		<ul id="sidebar">
			<li><Link to="/">Home</Link></li>
			<li><Link to="about">About</Link></li>
			<li><Link to="accounts">Accounts</Link></li>
			<li><Link to="profile">Profile</Link></li>
			<li><Link to="sell">Sell</Link></li>
			<li><button id="sign-in"><Link to="signin">Sign In</Link></button></li>
			<li><button id="sign-up"><Link to="signup">Sign Up</Link></button></li>
		</ul>
	</nav>
	<div>
		<Route path="/"><Home /></Route>
		<Route path="about" component={About} />
		<Route path="accounts" component={Accounts} />
		<Route path="profile" component={Profile} />
		<Route path="sell" component={Sell} />
		<Route path="signup" component={SignUp} />
		<Route path="signin" component={SignIn} />
	</div>
</Router>


<style>
	:global(body) {
		background-color: rgb(139, 75, 1);
	}

	#sidebar{
		list-style-type: none;
		float: left;
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
</style>
