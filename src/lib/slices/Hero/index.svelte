<script lang="ts">
	import { onMount } from 'svelte';
	import { PrismicImage, PrismicLink, PrismicRichText, PrismicText } from '@prismicio/svelte';

	import Bounded from '$lib/components/Bounded.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import TriangleGrid from '$lib/components/TriangleGrid.svelte';

	/** @type {import("@prismicio/client").Content.HeroSlice} */
	export let slice;

	import gsapModule from 'gsap';
	let gsap: typeof gsapModule;
	let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;

	onMount(async () => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (typeof window !== 'undefined') {
			const { default: gsapModule } = await import('gsap');
			const { ScrollTrigger: scrollTriggerModule } = await import('gsap/ScrollTrigger');
			gsap = gsapModule;
			ScrollTrigger = scrollTriggerModule;

			gsap.registerPlugin(ScrollTrigger);

			if (prefersReducedMotion) {
				gsap.set('.hero__heading, .hero__body, .hero__button, .hero__image, .hero__glow', {
					opacity: 1
				});
				return;
			}

			// Elements
			const heroHeading = document.querySelector('.hero__heading') as HTMLElement | null;
			const heroBody = document.querySelector('.hero__body') as HTMLElement | null;
			const heroButton = document.querySelector('.hero__button') as HTMLElement | null;
			const heroImage = document.querySelector('.hero__image') as HTMLElement | null;

			// Mousemove Animation
			const animateElement = (element: HTMLElement | null, xFactor: number, yFactor: number, scale: number = 1) => {
				element?.addEventListener('mousemove', (event: MouseEvent) => {
					const { clientX, clientY } = event;
					const { innerWidth, innerHeight } = window;
					const rotateX = (clientY / innerHeight - 0.5) * yFactor;
					const rotateY = (clientX / innerWidth - 0.5) * xFactor;

					gsap.to(element, {
						rotateX,
						rotateY,
						scale,
						transformPerspective: 800,
						duration: 0.4,
						ease: 'power2.out',
					});
				});
				element?.addEventListener('mouseleave', () => {
					gsap.to(element, {
						rotateX: 0,
						rotateY: 0,
						scale: 1,
						duration: 0.4,
						ease: 'power2.out',
					});
				});
			};

			// Applying animations with enhanced effects for title and body
			animateElement(heroHeading, 10, 10, 1.1);  // Enhanced 3D effect for title
			animateElement(heroBody, 15, 12, 1.1);     // Enhanced 3D effect for body text
			animateElement(heroButton, 8, 8);          // Standard tilt effect for the button
			animateElement(heroImage, 12, 10);         // Standard tilt effect for the image

			// Scroll-triggered animations for each element
			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: '.hero-section',
					start: 'top 80%',
					end: 'bottom 20%',
					toggleActions: 'play none none reverse',
				}
			});

			timeline.fromTo('.hero__heading', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
			timeline.fromTo('.hero__body', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.3 }, '-=0.6');
			timeline.fromTo('.hero__button', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.5');
			timeline.fromTo('.hero__image', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, '+=0.2');
			timeline.fromTo('.hero__glow', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.0, ease: 'elastic.out(1, 0.75)' }, '-=1.0');
		}
	});
</script>

<style>
	.hero__heading {
		color: #a4f9c8;
		text-shadow: 0px 5px 15px rgba(255, 25, 0, 0.3);
	}

	.hero__body {
		color: #b0c9df;
		text-shadow: 0px 3px 10px rgba(0, 0, 255, 0.2);
		animation: colorCycle 10s infinite alternate ease-in-out;
	}

	.hero__image {
		background: rgba(40, 70, 100, 0.4);
		border-radius: 12px;
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
		transition: transform 0.3s ease;
		box-shadow: 0px 20px 50px rgba(0, 150, 150, 0.4);
	}

	.hero__overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.1);
		mix-blend-mode: overlay;
		transition: transform 0.5s ease, rotate 0.5s ease;
		box-shadow: 0px 20px 50px rgba(0, 150, 150, 0.4);
		border-radius: 12px;
	}

	.hero__glow--one,
	.hero__glow--two {
		mix-blend-mode: overlay;
		filter: blur(100px);
	}

	@keyframes colorCycle {
		0% {
			color: #b0c9df;
		}
		20% {
			color: #a4e9d9;
		}
		40% {
			color: #e9e2a4;
		}
		60% {
			color: #c4a3df;
		}
		80% {
			color: #dfa3a3;
		}
		100% {
			color: #a3c4df;
		}
	}

	@keyframes moveParticles {
		from {
			transform: translateY(0px) scale(1.1);
		}
		to {
			transform: translateY(-20px) scale(1.05);
		}
	}
</style>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="hero-section">
	<div class="relative text-center">
		<TriangleGrid />

		{#if slice.primary.heading}
			<h1 class="hero__heading mx-auto max-w-3xl text-balance text-5xl font-semibold opacity-0 md:text-7xl">
				<PrismicText field={slice.primary.heading} />
			</h1>
		{/if}
		{#if slice.primary.body}
			<p class="hero__body mx-auto mt-6 max-w-lg text-balance text-gray-300 opacity-0">
				<PrismicText field={slice.primary.body} />
			</p>
		{/if}
		{#if slice.primary.button_link}
			<ButtonLink class="hero__button mt-8 opacity-0" field={slice.primary.button_link}>
				{slice.primary.button_label}
			</ButtonLink>
		{/if}
		{#if slice.primary.image}
			<div class="hero__image glass-container mt-16 w-fit opacity-0">
				<div class="hero__overlay"></div>
				<div class="hero__glow hero__glow--one absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-teal-600/50 opacity-0 mix-blend-overlay blur-3xl filter md:blur-[120px]"/>
				<div class="hero__glow hero__glow--two absolute left-0 top-1/3 -z-10 h-2/3 w-2/3 bg-green-500/50 opacity-0 mix-blend-overlay blur-3xl filter md:blur-[120px]"/>
				<PrismicImage class="rounded-lg" field={slice.primary.image} />
			</div>
		{/if}
	</div>
</Bounded>
