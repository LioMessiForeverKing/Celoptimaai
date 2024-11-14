<script lang="ts">
	import { onMount } from 'svelte';
	import type { Content } from '@prismicio/client';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import Bounded from '$lib/components/Bounded.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';

	// Prismic slice type
	export let slice: Content.BentoSlice;

	// Observer function to trigger animations
	function useIntersectionObserver(element: HTMLElement, callback: () => void) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						callback();
						observer.unobserve(element); // Trigger only once
					}
				});
			},
			{ threshold: 0.2 }
		);
		if (element) observer.observe(element);
	}

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) return;

		gsap.registerPlugin(ScrollTrigger);

		// Animate elements with 3D effect when they are visible
		const animateOnVisible = (selector: string, animation: gsap.TweenVars) => {
			document.querySelectorAll(selector).forEach((el) => {
				useIntersectionObserver(el as HTMLElement, () => {
					gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, ...animation });
				});
			});
		};

		// Apply animations
		animateOnVisible('.story__heading', { duration: 1.2, ease: 'power2.out' });
		animateOnVisible('.story__subheading', { duration: 1, delay: 0.2, ease: 'power2.out' });
		animateOnVisible('.story__body', { duration: 1.4, delay: 0.4, ease: 'power2.out' });
		animateOnVisible('.story__image', { duration: 1.6, scale: 1, ease: 'power2.inOut' });

		// 3D effect for the container
		gsap.fromTo(
			'.story__container',
			{ rotateY: '-10deg', rotateX: '10deg', opacity: 0 },
			{
				rotateY: '0deg',
				rotateX: '0deg',
				opacity: 1,
				duration: 1.5,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.story__container',
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				}
			}
		);
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="relative">
	<!-- Heading outside the container -->
	{#if slice.primary.heading}
		<h2 class="story__heading text-center text-5xl md:text-6xl font-bold mb-12 opacity-0">
			<PrismicRichText field={slice.primary.heading} />
		</h2>
	{/if}

	<!-- Glowing background effect -->
	<div class="story__glow absolute -z-10 w-full h-full rounded-full mix-blend-screen blur-[180px] filter" />

	<!-- Full-width, centered container with 3D and glass effect -->
	<div class="story__container flex flex-col items-center justify-center mx-auto w-full max-w-6xl rounded-3xl border border-gray-300/10 bg-gray-900/40 p-12 backdrop-blur-xl text-center space-y-8 shadow-2xl">
		{#if slice.primary.subheading}
			<h3 class="story__subheading text-2xl font-light text-gray-200 opacity-0 translate-z-[20px]">
				<PrismicRichText field={slice.primary.subheading} />
			</h3>
		{/if}

		{#if slice.primary.body}
			<div class="story__body prose prose-invert mx-auto text-lg opacity-0 translate-z-[10px]">
				<PrismicRichText field={slice.primary.body} />
			</div>
		{/if}

		<!-- Button Link -->
		{#if slice.primary.button_link}
			<ButtonLink field={slice.primary.button_link} class="mt-6 block w-fit mx-auto hover:scale-105 transition-transform duration-300">
				{slice.primary.button_label || 'Learn More'}
			</ButtonLink>
		{/if}

		<!-- Centered Prismic Image with 3D effect -->
		{#if slice.primary.image}
			<PrismicImage
				field={slice.primary.image}
				class="story__image mx-auto w-full max-w-2xl rounded-xl shadow-lg opacity-0 translate-z-[30px] hover:scale-105 transition-transform duration-500"
				sizes="(max-width: 768px) 100vw, 50vw"
			/>
		{/if}
	</div>
</Bounded>

<style>
	/* Dark blue glow effect */
	.story__glow {
		background: radial-gradient(circle, rgba(37, 99, 235, 0.5), transparent 80%);
	}

	/* 3D effect for elements */
	.story__heading {
		transition: opacity 0.5s ease, transform 0.5s ease;
	}

	.story__container {
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
		transform-style: preserve-3d;
	}

	.story__subheading, .story__body {
		transform-style: preserve-3d;
		transition: transform 0.5s ease, opacity 0.5s ease;
	}

	.story__container:hover {
		transform: rotateY(2deg) rotateX(-2deg);
	}
</style>
