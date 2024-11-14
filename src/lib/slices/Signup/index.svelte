<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText } from '@prismicio/svelte';
	import { db } from "../Signup/firebaseConfig";
	import { collection, doc, setDoc } from "firebase/firestore";
	import Bounded from '$lib/components/Bounded.svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let slice: Content.SignupSlice;

	// Firestore collection reference
	const usersCollection = collection(db, "user");

	// Form state
	let name = "";
	let email = "";
	let excited = "";

	// Status messages
	let message = "";
	let isLoading = false;

	// Function to create a document ID based on the user's information
	function generateDocumentId(name: string, email: string, excited: string): string {
		return `${name}-${email}-${excited}`.toLowerCase().replace(/\s+/g, '-');
	}

	// Function to handle form submission
	async function handleSignup() {
		isLoading = true;
		message = ""; // Reset message on new submission
		try {
			const docId = generateDocumentId(name, email, excited);
			await setDoc(doc(usersCollection, docId), { name, email, excited });
			message = "Signup successful!";
			name = "";
			email = "";
			excited = "";
		} catch (error) {
			console.error("Error during signup: ", error);
			message = "Error during signup. Please try again.";
		} finally {
			isLoading = false;
			gsap.fromTo('.message', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
		}
	}

	// GSAP animations for form elements on mount
	onMount(() => {
		gsap.fromTo(
			'.signup-form > div',
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, stagger: 0.2, duration: 0.6, ease: 'power2.out' }
		);
	});
</script>

<style>

	/* Form heading styling */
	.signup-heading {
		font-size: 2.2rem; /* Larger heading */
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	/* Form element styling */
	.signup-form {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	label {
		color: #ffffff;
		font-size: 1rem;
		margin-bottom: 0.5rem;
		display: block;
	}

	input {
		width: 100%;
		padding: 0.8rem;
		border-radius: 5px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.1); /* Slightly transparent input background */
		color: #ffffff;
		font-size: 1rem;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.6); /* Light placeholder color */
	}

	input:focus {
		border-color: #3498db;
		box-shadow: 0 0 8px rgba(52, 152, 219, 0.6);
		outline: none;
	}

	button {
		padding: 0.8rem;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 5px;
		font-size: 1.1rem;
		cursor: pointer;
		transition: background-color 0.3s ease, transform 0.2s ease;
	}

	button:disabled {
		background-color: #7f8c8d;
		cursor: not-allowed;
	}

	button:hover:not(:disabled) {
		background-color: #2980b9;
	}

	button:active {
		transform: scale(0.95);
	}

	/* Message styling */
	.message {
		margin-top: 1.5rem;
		font-weight: bold;
		color: #27ae60; /* Success color */
		text-align: center;
		opacity: 0;
	}

	.message.error {
		color: #e74c3c; /* Error color */
	}
</style>


<Bounded class="signup-container" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<!-- Render Prismic RichText field as a heading -->
	<div class="signup-heading">
		<PrismicRichText field={slice.primary.heading} />
	</div>

	<!-- Signup form with the container class applied -->
	<form class="signup-form" on:submit|preventDefault={handleSignup}>
		<div>
			<label for="name">{slice.primary.name || "Name"}</label>
			<input
				id="name"
				type="text"
				bind:value={name}
				placeholder={slice.primary.name || "Enter your name"}
				required
			/>
		</div>

		<div>
			<label for="email">{slice.primary.email || "Email"}</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				placeholder={slice.primary.email || "Enter your email"}
				required
			/>
		</div>

		<div>
			<label for="excited">{slice.primary.excited || "Excitement Level"}</label>
			<input
				id="excited"
				type="text"
				bind:value={excited}
				placeholder={slice.primary.excited || "Share your excitement"}
			/>
		</div>

		<button type="submit" disabled={isLoading}>
			{isLoading ? "Signing up..." : "Sign Up"}
		</button>
	</form>

	<!-- Display a message after submission -->
	{#if message}
		<p class="message {message.includes('Error') ? 'error' : ''}">{message}</p>
	{/if}
</Bounded>
