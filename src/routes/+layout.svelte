<script lang="ts">
	import { navigating, page } from '$app/stores'
	import { gsap } from 'gsap'

	const pages = [
		{ route: '/ressources', text: 'Ressources', color: '#ff667d' },
		{ route: '/works', text: 'Works', color: '#ff9776' },
		// { route: '/bonus', text: 'Bonus', color: '#82dab1' },
		{ route: '/', text: 'About', color: '#8283da' },
	]
	let routeId = $page.routeId
	const colWidth = 9
	let cols: number[] = new Array(pages.length).fill(colWidth)
	let currentIdx = pages.findIndex((p) => p.route == $page.routeId)
	$: currentIdx = pages.findIndex((p) => p.route == $page.routeId)
	cols[currentIdx] = 100 - (cols.length - 1) * colWidth

	let isTransitioning = false
	navigating.subscribe(async (nav) => {
		console.log(nav)
		if (nav == null || isTransitioning) return

		// Disable all links
		document
			.querySelectorAll<HTMLAnchorElement>('a')
			.forEach((a) => (a.style.pointerEvents = 'none'))

		isTransitioning = true
		const fromIdx = pages.findIndex((p) => p.route == nav.from?.routeId)
		const toIdx = pages.findIndex((p) => p.route == nav.to?.routeId)
		const direction = fromIdx < toIdx ? 'ltr' : 'rtl'

		// Hide the links
		await gsap.to('a', {
			duration: 0.5,
			color: 'transparent',
		})

		// Animate the current link (hidden)
		await gsap.fromTo(
			`[href="${pages[fromIdx].route}"]`,
			{
				order: direction == 'ltr' ? '1' : '0',
				opacity: 1,
				width: '0%',
			},
			{
				width: '100%',
				duration: 0.5,
				ease: 'Power2.easeOut',
			},
		)

		// Travel the blocks
		let i = fromIdx
		while ((direction == 'ltr' ? i++ : i--) != toIdx) {
			const newCols = new Array(pages.length).fill(9)
			newCols[i] = 100 - (newCols.length - 1) * colWidth
			await gsap.to(cols, {
				endArray: newCols,
				onUpdate: () => {
					cols = cols
				},
				duration: 0.5,
				ease: 'Power2.easeOut',
			})
		}

		await gsap.fromTo(
			`[href="${pages[toIdx].route}"]`,
			{
				order: direction == 'ltr' ? 0 : 1,
				width: '100%',
			},
			{
				width: '0%',
				duration: 0.2,
				ease: 'Power2.easeOut',
			},
		)

		routeId = nav.to!.routeId!

		// Show the links
		await gsap.to(`a:not([href="${pages[toIdx].route}"])`, {
			duration: 0.5,
			color: 'white',
			pointerEvents: 'all',
		})
		isTransitioning = false
	})
</script>

<aside style={`grid-template-columns: ${cols.map((c) => (c ? c + 'vw' : 0)).join(' ')}`}>
	{#each pages as page}
		<section>
			<a
				href={page.route}
				style={`background: ${page.color}; ${
					page.route == routeId ? 'opacity: 0; pointer-events: none' : ''
				}`}
			>
				{page.text}
			</a>
			<div class="expand" />
		</section>
	{/each}
</aside>

<main style={`grid-template-columns: ${cols.map((c) => (c ? c + 'vw' : 0)).join(' ')}`}>
	<div style={`grid-column: ${currentIdx + 1}`}>
		<slot />
	</div>
</main>

<style>
	:global(*) {
		margin: 0;
		box-sizing: border-box;
	}

	:global(body) {
		width: 100%;
		overflow-x: hidden;
		background: linear-gradient(0deg, #fff, #f9f5ed);
	}

	aside {
		height: 100vh;
		display: grid;
		position: fixed;
	}

	section {
		display: flex;
	}

	.expand {
		flex: 1;
		pointer-events: none;
	}

	a {
		width: 100%;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		text-decoration: none;
		color: white;
	}

	main {
		display: grid;
		min-height: 150vh;
	}
</style>
