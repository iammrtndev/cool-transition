<script lang="ts">
	import { navigating, page } from '$app/stores'

	function waitForAnimationEnd(target: HTMLElement) {
		return new Promise((resolve) => {
			document.addEventListener('animationend', (event: AnimationEvent) => {
				if (event.target == target) resolve(target)
			})
		})
	}

	type Page = {
		route: string
		text: string
		color: string
		a: HTMLAnchorElement
		bg: HTMLDivElement
		txt: HTMLDivElement
		txtSpan: HTMLSpanElement
	}
	const pages: Page[] = [
		{ route: '/ressources', text: 'Ressources', color: '#ff667d' } as Page,
		{ route: '/works', text: 'Works', color: '#ff9776' } as Page,
		{ route: '/', text: 'About', color: '#8283da' } as Page,
	]
	let routeId = $page.route.id!
	let nextRouteId = routeId!

	const widthVW = 9

	navigating.subscribe(async (nav) => {
		if (nav == null) return

		pages.forEach((p) => {
			p.a.style.pointerEvents = 'none'
			p.txtSpan.classList.add('hide')
		})
		await Promise.all(pages.map((p) => waitForAnimationEnd(p.txtSpan!)))
		const fromIdx = pages.findIndex((p) => p.route == nav.from!.route.id)
		const toIdx = pages.findIndex((p) => p.route == nav.to!.route.id)
		const ltr = fromIdx > toIdx
		nextRouteId = nav.to!.route.id!

		const pagesSlide = pages.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1)
		pagesSlide.forEach((p) => {
			p.a.classList.add(ltr ? 'ltr' : 'rtl')
		})
		await Promise.all(pagesSlide.map((p) => waitForAnimationEnd(p.a!)))

		pages.forEach((p) => {
			p.txtSpan.classList.replace('hide', 'show')
		})
		await Promise.all(pages.map((p) => waitForAnimationEnd(p.txtSpan!)))

		routeId = nextRouteId

		pagesSlide.forEach((p) => {
			p.a.classList.remove(ltr ? 'ltr' : 'rtl')
		})
		pages.forEach((p) => {
			p.a.style.pointerEvents = 'all'
			p.txtSpan.classList.remove('show')
		})
	})
</script>


<main>
	{#each pages as page}
		<section class:flex1={page.route == nextRouteId}>
			{#if page.route == nextRouteId}
				<slot />
			{/if}
		</section>
	{/each}
</main>

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

	main {
		position: relative;
		display: flex;
		flex-direction: row;
	}

	section {
		width: 9vw;
	}
	.flex1 {
		flex: 1;
	}

	aside {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: row;
		position: fixed;
		top: 0;
	}

	a {
		position: relative;
		height: 100%;
		text-decoration: none;
	}
	a.active {
		pointer-events: none !important;
		flex: 1;
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
		color: white;
		font-family: Arial, Helvetica, sans-serif;
		font-size: xx-large;
		position: absolute;
		z-index: 2;
		bottom: 40px;
		left: 3.5vw;
		writing-mode: vertical-rl;
		overflow: hidden;
	}
	a.active .txtSpan {
		visibility: hidden;
	}
	.txtSpan {
		animation-duration: 1s;
		animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1); /* easeInOutQuart */
		animation-fill-mode: forwards;
		position: relative;
	}
	:global(.txtSpan.hide) {
		animation-name: txtSpanHide;
	}
	:global(.txtSpan.show) {
		animation-name: txtSpanShow;
	}
	@keyframes txtSpanHide {
		0% {
			right: 0px;
		}
		100% {
			right: 40px;
		}
	}
	@keyframes txtSpanShow {
		0% {
			right: 40px;
			visibility: visible;
		}
		100% {
			right: 0px;
			visibility: visible;
		}
	}

	a,
	.txt,
	.bg {
		animation-duration: 2s;
		animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1); /* easeInOutQuart */
		animation-fill-mode: forwards;
		animation-delay: var(--delay);
	}

	/* LEFT TO RIGHT */
	:global(a.ltr:nth-child(1)) {
		--delay: 0.2s;
		z-index: 1;
	}
	:global(a.ltr:nth-child(2)) {
		--delay: 0.1s;
		z-index: 2;
	}
	:global(a.ltr:nth-child(3)) {
		--delay: 0s;
		z-index: 3;
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

	/* RIGHT TO LEFT */
	:global(a.rtl:nth-child(1)) {
		--delay: 0s;
		z-index: 3;
	}
	:global(a.rtl:nth-child(2)) {
		--delay: 0.1s;
		z-index: 2;
	}
	:global(a.rtl:nth-child(3)) {
		--delay: 0.2s;
		z-index: 1;
	}
	:global(a.rtl) {
		animation-name: rtlA;
		--translateX-Start: 0vw;
		--translateX-End: -73vw;
	}
	:global(a.active.rtl) {
		animation-name: rtlA;
		--translateX-Start: 73vw;
		--translateX-End: 0vw;
	}
	:global(a.next.rtl) {
		animation-name: rtlA;
		--translateX-End: -82vw;
	}
	@keyframes rtlA {
		0% {
			transform: translateX(var(--translateX-Start));
		}
		50% {
			transform: translateX(var(--translateX-Start));
		}

		100% {
			transform: translateX(var(--translateX-End));
		}
	}

	:global(a.rtl .bg) {
		transform-origin: right;
		animation-name: rtlBg;
		--scale3d-x-Start: 1;
		--scale3d-x-Mid: calc(82 / 9);
		--scale3d-x-End: 1;
	}
	:global(a.active.rtl .bg) {
		--scale3d-x-Start: 0;
		--scale3d-x-Mid: calc(82 / 9);
	}
	:global(a.next.rtl .bg) {
		--scale3d-x-End: 0;
	}
	@keyframes rtlBg {
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
