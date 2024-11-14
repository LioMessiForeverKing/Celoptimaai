<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	const grid: [number, number] = [12, 24]; // Define the rows and columns of the hexagon grid

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			gsap.set('#hex-grid', { opacity: 1 });
			gsap.set('.hex-grid-item', {
				opacity: 0.2,
				scale: 1
			});
			return;
		}

		gsap.set('.hex-grid-item', {
			opacity: 0,
			transformOrigin: 'center',
			color: '#A0E7E5'
		});

		gsap.set('#hex-grid', { opacity: 1 });

		const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 }); // Repeat the animation with a delay

		// Fade-In Animation
		tl.to('.hex-grid-item', {
			opacity: 0.6,
			scale: 1.2,
			color: () => gsap.utils.random(['#64D2FF', '#A0E7E5', '#A78BFA', '#34D399']),
			duration: 1.5,
			stagger: {
				amount: 1.5,
				grid: grid,
				from: 'center'
			}
		});

		// Hold Visibility
		tl.to('.hex-grid-item', {
			opacity: 0.6,
			scale: 1,
			duration: 2
		});

		// Fade-Out Animation
		tl.to('.hex-grid-item', {
			opacity: 0,
			duration: 1.5,
			stagger: {
				amount: 1.5,
				grid: grid,
				from: 'center'
			}
		});
	});
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 935 425"
	class="absolute -left-2 -top-14 -z-10"
	id="hex-grid"
	opacity={0}
	style="mask-image: linear-gradient(black, transparent);"
>
	<g class="hex-grid-group">
		{#each Array(grid[0]) as _, i}
			{#each Array(grid[1]) as __, j}
				<path
					fill="currentColor"
					opacity=".2"
					class="hex-grid-item"
					d={`M${j * 35 + (i % 2) * 17},${i * 30} 
						l15,8.66 
						l15,-8.66 
						l0,-17.32 
						l-15,-8.66 
						l-15,8.66 
						z`}
				/>
			{/each}
		{/each}
	</g>
</svg>
