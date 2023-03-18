<h1>Sign up</h1>
<form action="" method="post" id="flex">
	<label for="username">Username: <input type="text"></label>
	<label for="fName">First Name: <input type="text"></label>
	<label for="lName">Last Name: <input type="text" name="" id=""></label>
	<label for="password">Password: <input type="text"></label>
	<label for="repassword">Re-enter password: <input type="text" name="" id=""></label>
	<label for="email">E-mail: <input type="text" name="" id=""></label>
	<label for="phone">Phone number: <input type="text" name="" id=""></label>
	<label for="address">Home address: <input type="text" name="" id=""></label>
	<button type="submit">Sign up</button>
</form>

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