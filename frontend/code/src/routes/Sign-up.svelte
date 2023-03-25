<script>

	let username = ""
	let name = ""
	let surname = ""
	let password = ""
	let accountWasCreated = false
	let errorMessages = []

	async function createAccount(){
		const account = {
			username,
			name,
			surname,
			password,
		}
		try {
			const response = await fetch("http://localhost:8080/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(account),
			})

			switch(response.status){
				case 201:
					accountWasCreated = true
				break

				case 400:
					errorMessages = await response.json()
				break
			}
		} catch (error) {
			errorMessages.push("COMMUNICATION_ERROR")
			errorMessages = errorMessages
		}

	}

</script>

<h1>Sign up</h1>
{#if accountWasCreated}
 <p>Account created!</p>
{:else}
	<form on:submit|preventDefault={createAccount} id="flex">
		<label for="username">Username: <input type="text" bind:value={username}></label>
		<label for="fName">First Name: <input type="text" bind:value={name}></label>
		<label for="lName">Last Name: <input type="text" name="" id="" bind:value={surname}></label>
		<label for="password">Password: <input type="password" bind:value={password}></label>
		<button type="submit">Sign up!</button>
	</form>
	{#if 0 < errorMessages.length}
		<p>We have errors!</p>
		<ul>
			{#each errorMessages as errorMessage}
				<li>{errorMessage}</li>
			{/each}
		</ul>
	{/if}
{/if}



<style>
	#flex {
		display: flex;
		flex-direction: column;
	}

	input {
		margin-bottom: 10px;
	}

	button {
		width: fit-content;
	}
</style>