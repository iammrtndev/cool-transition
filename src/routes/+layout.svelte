<script lang="ts">
	import { navigating, page } from '$app/stores'

	function waitForAnimationEnd(target: HTMLElement) {
		return new Promise((resolve) => {
			document.addEventListener('animationend', (event: AnimationEvent) => {
				if (event.target == target) resolve(target)
			})
		})
	}

	function waitForTransitionEnd(target: HTMLElement) {
		return new Promise((resolve) => {
			document.addEventListener('transitionend', (event: TransitionEvent) => {
				if (event.target == target) resolve(target)
			})
		})
	}

	type Page = {
		route: string
		text: string
		color: string
		a?: HTMLAnchorElement
		bg?: HTMLDivElement
		txt?: HTMLDivElement
		txtSpan?: HTMLSpanElement
	}
	const pages: Page[] = [
		{ route: '/ressources', text: 'Ressources', color: '#ff667d' },
		{ route: '/works', text: 'Works', color: '#ff9776' },
		{ route: '/', text: 'About', color: '#8283da' },
	]
	let routeId = $page.routeId!
	let nextRouteId = routeId!

	const widthVW = 9

	navigating.subscribe(async (nav) => {
		if (nav == null) return

		pages.forEach((p) => {
			p.txtSpan!.classList.add('hide')
		})
		await Promise.all(pages.map((p) => waitForTransitionEnd(p.txtSpan!)))
		const fromIdx = pages.findIndex((p) => p.route == nav.from!.routeId)
		const toIdx = pages.findIndex((p) => p.route == nav.to!.routeId)
		const ltr = fromIdx > toIdx
		nextRouteId = nav.to!.routeId!

		const pagesSlide = pages.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1)
		pagesSlide.forEach((p) => {
			p.a?.classList.add(ltr ? 'ltr' : 'rtl')
			// 	p.bg!.style.setProperty('--transform-origin-Start', 'left')
			// 	p.bg!.style.setProperty('--transform-origin-End', 'right')
			// 	p.bg!.style.setProperty('--transaleX-Start', '0vw')
			// 	p.bg!.style.setProperty('--transaleX-End', `${100 - widthVW * (pages.length - (activeNext ? 1 : 0))}vw`)
			// 	p.bg!.style.setProperty('--scale3d-x-Start', `${active ? 0 : 1}`)
			// 	p.bg!.style.setProperty('--scale3d-x-Mid', `${(100 - widthVW * (pages.length - 1)) / widthVW}`)
			// 	p.bg!.style.setProperty('--scale3d-x-End', `${activeNext ? 0 : 1}`)
			// 	p.txt!.style.setProperty('--transaleX-Start', '0vw')
			// 	p.txt!.style.setProperty('--transaleX-End', `${100 - widthVW * (pages.length - (activeNext ? 1 : 0))}vw`)
			// }
			// else {
			// p.a!.style.setProperty('--delay', `${pages.indexOf(p) * 0.1}s`)
			// 		p.bg!.style.setProperty('--transform-origin-Start', 'right')
			// 		p.bg!.style.setProperty('--transform-origin-End', 'left')
			// 		p.bg!.style.setProperty('--transaleX-Start', active ? `${100 - widthVW * pages.length}vw` : '0vw')
			// 		p.bg!.style.setProperty('--transaleX-End', active ? '0' : `-${100 - widthVW * (pages.length - (activeNext ? 1 : 0))}vw`)
			// 		p.bg!.style.setProperty('--scale3d-x-Start', `${active ? 0 : 1}`)
			// 		p.bg!.style.setProperty('--scale3d-x-Mid', `${(100 - widthVW * (pages.length - 1)) / widthVW}`)
			// 		p.bg!.style.setProperty('--scale3d-x-End', `${activeNext ? 0 : 1}`)
			// 	}
			// p.a!.classList.add('animate')
		})
		// const pagesStatic = pages.filter((p) => !pagesSlide.includes(p))
		// pagesStatic.forEach((p) => {
		// 	const translateX = '0vw'
		// 	const scale3dX = '1'
		// 	p.bg!.style.setProperty('--transaleX-Start', translateX)
		// 	p.bg!.style.setProperty('--transaleX-End', translateX)
		// 	p.bg!.style.setProperty('--scale3d-x-Start', scale3dX)
		// 	p.bg!.style.setProperty('--scale3d-x-Mid', scale3dX)
		// 	p.bg!.style.setProperty('--scale3d-x-End', scale3dX)

		// 	p.txt!.style.setProperty('--transaleX-Start', '0vw')
		// 	p.txt!.style.setProperty('--transaleX-End', '0')
		// })

		await Promise.all(pagesSlide.map((p) => waitForAnimationEnd(p.a!)))

		routeId = nextRouteId
		nextRouteId = ''

		pages.forEach((p) => {
			p.txtSpan!.classList.remove('hide')
		})
		await Promise.all(pages.map((p) => waitForTransitionEnd(p.txtSpan!)))
	})
</script>

<aside>
	{#each pages as page}
		<a
			bind:this={page.a}
			class:active={page.route == routeId}
			class:next={page.route == nextRouteId}
			href={page.route}
			style={`
				width: ${widthVW}vw;
			`}
		>
			<div
				bind:this={page.bg}
				class="bg"
				style={`
					background: ${page.color};
					max-width: ${widthVW}vw;
				`}
			/>
			<div bind:this={page.txt} class="txt">
				<span bind:this={page.txtSpan} class="txtSpan">
					{page.text}
				</span>
			</div>
		</a>
	{/each}
</aside>

<style>
	:global(*) {
		margin: 0;
		box-sizing: border-box;
	}

	:global(body) {
		width: 100%;
		/* background: linear-gradient(0deg, #fff, #f9f5ed); */
	}

	aside {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: row;
		position: fixed;
	}

	a {
		position: relative;
		height: 100%;
		text-decoration: none;
	}
	a.active {
		pointer-events: none;
	}
	.bg {
		position: absolute;
		height: 100%;
		width: 100%;
	}
	a.active .bg {
		transform: scale3d(0, 1, 1);
	}

	.txt {
		color: black;
		font-family: Arial, Helvetica, sans-serif;
		font-size: xx-large;
		position: absolute;
		z-index: 2;
		bottom: 40px;
		left: 3.5vw;
		writing-mode: vertical-rl;
		overflow: hidden;
	}

	a.active .txt {
		color: transparent;
	}

	.txtSpan {
		position: relative;
		right: 0px;
		transition: all 500ms cubic-bezier(0.55, 0.055, 0.675, 0.19); /* easeInCubic */
	}
	:global(.txtSpan.hide) {
		right: 40px !important;
	}

	a,
	.txt,
	.bg {
		animation-duration: 2s;
		animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1); /* easeInOutQuart */
		animation-fill-mode: forwards;
		animation-delay: var(--delay);
	}
	:global(a.ltr:nth-child(1)) {
		--delay: 0.2s;
	}
	:global(a.ltr:nth-child(2)) {
		--delay: 0.1s;
	}
	:global(a.ltr:nth-child(3)) {
		--delay: 0s;
	}
	:global(a.ltr) {
		animation-name: ltrA;
		--translateX-End: 73vw;
	}
	:global(a.next.ltr) {
		animation-name: ltrA;
		--translateX-End: 82vw;
	}
	@keyframes ltrA {
		0% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(var(--translateX-End));
		}
	}

	:global(a.ltr .bg) {
		transform-origin: left;
		animation-name: ltrBg;
		--scale3d-x-Start: 1;
		--scale3d-x-Mid: calc(82 / 9);
		--scale3d-x-End: 1;
	}
	:global(a.active.ltr .bg) {
		--scale3d-x-Start: 0;
	}
	:global(a.next.ltr .bg) {
		--scale3d-x-End: 0;
	}
	@keyframes ltrBg {
		0% {
			transform: scale3d(var(--scale3d-x-Start), 1, 1);
		}

		50% {
			transform: scale3d(var(--scale3d-x-Mid), 1, 1);
		}

		100% {
			transform: scale3d(var(--scale3d-x-End), 1, 1);
		}
	}
</style>
