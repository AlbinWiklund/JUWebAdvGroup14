<script>
	import { user } from "../user-store.js"


	let username = ""
	let password = ""
	let signInWasSuccessful = false

	let errorMessages = []

	async function signin(){
		const response = await fetch("http://localhost:8080/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
		})

		const body = await response.json()

		switch(response.status){
			case 200:
				const accessToken = body.access_token
				const accountID = body.accountID

				$user = {
					isLoggedIn: true,
					accessToken,
					accountID,
				}
				break

			case 400:
				errorMessages = ["Wrong username or password"]
				console.log(errorMessages)
				break
		}
	}
</script>

<h1>Sign in</h1>

{#if signInWasSuccessful}
	<p>Welcome, {username}!</p>
{:else}
	<form on:submit|preventDefault={signin} id="flex">
		<label for="username">Username: <input type="text" bind:value={username}></label>
		<label for="password">Password: <input type="password" bind:value={password}></label>
		<button type="submit">Sign in</button>
	</form>

	{#if 0 < errorMessages.length}
		<p>Error messages:</p>
		<ul>
			<li>
				{errorMessages[0]}
			</li>
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