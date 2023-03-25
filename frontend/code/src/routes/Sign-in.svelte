<script>
	import { user } from "../user-store.js"
	import jwt_decode from 'jwt-decode'

	let username = ""
	let password = ""

	let errorMessages = []
	
	async function signin(){
		const response = await fetch("http://localhost:8080/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
		})

		errorMessages = []

		const body = await response.json()

		switch(response.status){
			case 200:
				const idToken = jwt_decode(body.id_token)
				const accessToken = body.access_token
				//Have to have these as last resort, wanted to make an interface but JS does not support interfaces
				// @ts-ignore
				const accountID = idToken.sub
				// @ts-ignore
				const username = idToken.username

				$user = {
					isLoggedIn: true,
					accessToken,
					accountID,
					username,
				}
				break

			case 400:
				errorMessages = body
				break
		}
	}
</script>

<h1>Sign in</h1>

{#if $user.isLoggedIn}
	<p>Welcome, {$user.username}!</p>
{:else}
	<form on:submit|preventDefault={signin} id="flex">
		<label for="username">Username: <input type="text" bind:value={username}></label>
		<label for="password">Password: <input type="password" bind:value={password}></label>
		<button type="submit">Sign in</button>
	</form>

	{#if 0 < errorMessages.length}
		<p>Error messages:</p>
		<ul>
			{#each errorMessages as errorMessage}
				<li>{errorMessage}</li>
			{/each}
		</ul>
	{/if}
{/if}

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