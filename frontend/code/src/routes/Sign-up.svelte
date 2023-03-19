<script>

	let username = ""
	let name = ""
	let surname = ""
	let password = ""
	let accountWasCreated = false
	let errorCodes = []

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
					errorCodes = await response.json()
				break
			}

		} catch (error) {
			
			errorCodes.push("COMMUNICATION_ERROR")
			errorCodes = errorCodes
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
		<label for="password">Password: <input type="text" bind:value={password}></label>
		<label for="repassword">Re-enter password: <input type="text" name="" id=""></label>
		<button type="submit">Sign up!</button>
	</form>
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