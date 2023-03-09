<script>
  import Card from "../lib/accountCard.svelte"
	import { onMount } from "svelte";

	let allAccounts;
	let account;

	export let accountId;

	async function getData(){
		const response = await fetch('../../dummyDataAccounts.json');
		const data = await response.json();
		
		getAccountFromData(data);
	}

	async function getAccountFromData(accounts){
			for (const element of accounts){
				if (element.id == accountId) {
					account = element;
				}
					
			}
	}

	onMount(getData);
</script>

{#if account}
	<div id="grid">
		<div id="about">
			<div id="profilePic">{account.id}</div>
			<div id="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam nobis aspernatur iste! Magni eius consequatur fugit voluptates hic natus placeat ducimus repudiandae qui repellat tempora praesentium, nisi sunt! Aliquam, perspiciatis!</div>
		</div>
		<div id="other">
			<div id="listing">
				<h2>
					Product Listing
				</h2>
			</div>
			<div id="review">
				<h2>
					Reviews
				</h2>
			</div>
		</div>
	</div>
{/if}


<style>
	#grid{
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
		grid-template-areas: 
		"about"
		"other";
		border: 2px solid black;
	}

	#about{
		grid-area: about;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 2fr 1fr;
		grid-template-areas: 
		"profilePic"
		"description";
		height: 400px;
	}

	#other{
		grid-area: other;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: 
		"listing review";
	}

	#profilePic{
		grid-area: profilePic;
	}

	#description{
		grid-area: description;
		border-top: 2px solid black;
		background-color: beige;
		color: black;
		padding: 8px;
	}

	#listing{
		grid-area: listing;
		border-top: 2px solid black;
		border-right: 2px solid black;
		padding: 8px;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	#review{
		grid-area: review;
		border-top: 2px solid black;
		padding: 8px;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>