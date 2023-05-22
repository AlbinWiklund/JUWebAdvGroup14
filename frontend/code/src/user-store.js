import { writable } from "svelte/store"

export const user = writable({
	isLoggedIn: false,
	accessToken: "",
	accountID: 0,
	username: "",
})