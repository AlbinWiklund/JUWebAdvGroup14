<script>
	import { user } from "../user-store.js"

	export let accountId;

	let username = ""
	let name = ""
	let surname = ""
	let password = ""
	let accountWasUpdated = false
	let errorMessages = []

	async function getAccount(){
		const response = await fetch("http://localhost:8080/account/"+accountId)

		switch (response.status){
			case 200:
				const account = await response.json()
				console.log("this is the account", account)
				username = account[0].username
				name = account[0].name
				surname = account[0].surname
				password = account[0].password
				break
			case 500:
				errorMessages = await response.json()
				break
		}
	}

	getAccount()

	async function updateAccount(){
		const account = {
			accountId,
			username,
			name,
			surname,
			password,
		}
		try {
			const response = await fetch("http://localhost:8080/account/"+accountId+"/update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+$user.accessToken
				},
				body: JSON.stringify(account),
			})

			switch(response.status){
				case 200:
					accountWasUpdated = true
					console.log("Account was updated")
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

<h1>Update account info</h1>

<form on:submit|preventDefault={updateAccount} id="flex">
	<label for="username">Username: <input type="text" bind:value={username}></label>
	<label for="fName">First Name: <input type="text" bind:value={name}></label>
	<label for="lName">Last Name: <input type="text" name="" id="" bind:value={surname}></label>
	<label for="password">Password: <input type="password" bind:value={password}></label>
	<label for="repassword">Re-enter password: <input type="password"></label>
	<button type="submit">Update account</button>
</form>
{#if 0 < errorMessages.length}
	<p>We have errors!</p>
	<ul>
		{#each errorMessages as errorMessage}
			<li>{errorMessage}</li>
		{/each}
	</ul>
{/if}
{#if accountWasUpdated}
	<p>Account updated!</p>
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