<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import { PrismicRichText } from '@prismicio/svelte';
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	export let slice: Content.StorySlice;

	onMount(() => {
		// GSAP animation for heading fade-in with a smooth lift
		gsap.fromTo(
			'.coming-soon-heading',
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.3 }
		);
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="coming-soon-container">
		<div class="coming-soon-heading">
			<PrismicRichText field={slice.primary.heading} />
		</div>
	</div>
</Bounded>

<style>
	.coming-soon-container {
		text-align: center;
		padding: 3rem 0;
	}

	.coming-soon-heading {
		font-size: 3.5rem;
		font-weight: 700;
		color: #1e90ff; /* Brand color */
		text-shadow: 0 0 10px rgba(30, 144, 255, 0.6), 0 0 20px rgba(30, 144, 255, 0.4); /* Glow effect */
		margin-bottom: 1rem;
		opacity: 0; /* Initial state for GSAP animation */
	}

	/* Additional subtle pulsing glow effect for a modern look */
	@keyframes glow {
		0%, 100% {
			text-shadow: 0 0 15px rgba(30, 144, 255, 0.6), 0 0 30px rgba(30, 144, 255, 0.3);
		}
		50% {
			text-shadow: 0 0 25px rgba(30, 144, 255, 0.8), 0 0 40px rgba(30, 144, 255, 0.5);
		}
	}

	.coming-soon-heading {
		animation: glow 2s infinite alternate;
	}
</style>
