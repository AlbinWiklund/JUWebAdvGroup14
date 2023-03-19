<script>
	import { user } from "../user-store.js"


	let username = ""
	let password = ""

	async function signin(){
		const response = await fetch("http://localhost:8080/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
		})

		const body = await response.json()

		const accessToken = body.access_token

		$user = {
			isLoggedIn: true,
			accessToken,
		}
	}
</script>

<h1>Sign in</h1>

<form on:submit|preventDefault={signin} id="flex">
	<label for="username">Username: <input type="text" bind:value={username}></label>
	<label for="password">Password: <input type="password" bind:value={password}></label>
	<button type="submit">Sign in</button>
</form>

<style>
	#flex{
		display: flex;
		flex-direction: column;
	}

	input {
		margin: 10px;
	}
	button {
		margin: 10px;
		max-width: fit-content;
	}
</style>