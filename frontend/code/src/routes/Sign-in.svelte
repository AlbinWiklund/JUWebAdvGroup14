<h1>Sign in</h1>

<form action="" method="post" id="flex">
	<label for="username">Username: <input type="text" name="username" id="username"></label>
	<label for="password">Password: <input type="password" name="password" id="password"></label>
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