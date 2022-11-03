<script lang="ts">
	import { navigating, page } from '$app/stores'
	import { onMount } from 'svelte'

	type Page = {
		route: string
		text: string
		color: string
		aEl?: HTMLAnchorElement
		bgEl?: HTMLDivElement
		txt?: HTMLDivElement
	}
	const pages: Page[] = [
		{ route: '/ressources', text: 'Ressources', color: '#ff667d' },
		{ route: '/works', text: 'Works', color: '#ff9776' },
		{ route: '/', text: 'About', color: '#8283da' },
	]
	let routeId = $page.routeId!
	let nextRouteId = routeId!
	let animate = false

	const widthVW = 9

	navigating.subscribe(async (nav) => {
		if (nav == null) return

		const fromIdx = pages.findIndex((p) => p.route == nav.from!.routeId)
		const toIdx = pages.findIndex((p) => p.route == nav.to!.routeId)
		const leftToRight = fromIdx > toIdx
		nextRouteId = nav.to!.routeId!

		const pagesSlide = pages.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1)
		pagesSlide.forEach((p) => {
			const route = p.aEl?.href.replace(location.origin, '')
			const active = route == routeId
			const activeNext = route == nextRouteId
			console.log(route)

			if (leftToRight) {
				p.aEl!.style.setProperty('--delay', `${(pages.length - pages.indexOf(p) - 1) * 0.1}s`)
				p.bgEl!.style.setProperty('--transform-origin-Start', 'left')
				p.bgEl!.style.setProperty('--transform-origin-End', 'right')
				p.bgEl!.style.setProperty('--transaleX-Start', '0vw')
				p.bgEl!.style.setProperty('--transaleX-End', `${100 - widthVW * (pages.length - (activeNext ? 1 : 0))}vw`)
				p.bgEl!.style.setProperty('--scale3d-x-Start', `${active ? 0 : 1}`)
				p.bgEl!.style.setProperty('--scale3d-x-Mid', `${(100 - widthVW * (pages.length - 1)) / widthVW}`)
				p.bgEl!.style.setProperty('--scale3d-x-End', `${activeNext ? 0 : 1}`)
			} else {
				p.aEl!.style.setProperty('--delay', `${pages.indexOf(p) * 0.1}s`)
				p.bgEl!.style.setProperty('--transform-origin-Start', 'right')
				p.bgEl!.style.setProperty('--transform-origin-End', 'left')
				p.bgEl!.style.setProperty('--transaleX-Start', `${100 - widthVW * (pages.length - (active ? 1 : 0))}vw`)
				p.bgEl!.style.setProperty('--transaleX-End', '0vw')
				p.bgEl!.style.setProperty('--scale3d-x-Start', `${active ? 0 : 1}`)
				p.bgEl!.style.setProperty('--scale3d-x-Mid', `${(100 - widthVW * (pages.length - 1)) / widthVW}`)
				p.bgEl!.style.setProperty('--scale3d-x-End', `${active ? 0 : 1}`)
			}
		})
		const pagesStatic = pages.filter((p) => !pagesSlide.includes(p))
		pagesStatic.forEach((p) => {
			if (leftToRight) {
				const translateX = '0vw'
				const scale3dX = '1'
				p.bgEl!.style.setProperty('--transaleX-Start', translateX)
				p.bgEl!.style.setProperty('--transaleX-End', translateX)
				p.bgEl!.style.setProperty('--scale3d-x-Start', scale3dX)
				p.bgEl!.style.setProperty('--scale3d-x-Mid', scale3dX)
				p.bgEl!.style.setProperty('--scale3d-x-End', scale3dX)
			} else {
				const translateX = `${100 - widthVW * pages.length}vw`
				const scale3dX = `${(100 - widthVW * (pages.length - 1)) / widthVW}`
				p.bgEl!.style.setProperty('--transaleX-Start', translateX)
				p.bgEl!.style.setProperty('--transaleX-End', translateX)
				p.bgEl!.style.setProperty('--scale3d-x-Start', scale3dX)
				p.bgEl!.style.setProperty('--scale3d-x-Mid', scale3dX)
				p.bgEl!.style.setProperty('--scale3d-x-End', scale3dX)
			}
		})
		animate = true
	})

	onMount(() => {
		document.addEventListener('animationend', (e) => {
			animate = false
			// routeId = nextRouteId
		})
	})
</script>

<aside>
	{#each pages as page, i}
		<a
			bind:this={page.aEl}
			class:animate
			class:active={page.route == routeId}
			href={page.route}
			style={`
				width: ${widthVW}vw;
			`}
		>
			<div
				bind:this={page.bgEl}
				class="bg"
				style={`
					background: ${page.color};
					max-width: ${widthVW}vw;
				`}
			/>
			<div
				bind:this={page.txt}
				class="txt"
				style={`
					visibility: ${page.route == routeId ? 'hidden' : 'visible'};
					--transaleX-Start: 0vw;
					--transaleX-End: ${100 - widthVW * pages.length}vw;
				`}
			>
				<span>
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
		width: var(--linkWidth);
		text-decoration: none;
	}
	a.active {
		pointer-events: none;
		flex: 1;
	}

	a .bg {
		transform: translateX(0) scale3d(1, 1, 1);
		position: absolute;
		height: 100%;
		width: 100%;
	}
	a.active .bg {
		transform: translateX(0) scale3d(0, 1, 1);
	}

	a .txt {
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

	a .txt span {
		position: relative;
	}

	:global(a.animate .txt),
	:global(a.animate .txt span),
	:global(a.animate .bg) {
		animation-duration: 3s;
		animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); /* easeInOutCubic */
		animation-fill-mode: forwards;
		animation-delay: var(--delay);
	}
	:global(a.animate .txt) {
		animation-name: txt;
	}
	:global(a.animate .txt span) {
		animation-name: txtSpan;
	}
	:global(a.animate .bg) {
		animation-name: bg;
	}
	@keyframes txt {
		0% {
			transform: translateX(var(--transaleX-Start));
		}
		15% {
			transform: translateX(var(--transaleX-Start));
		}

		100% {
			transform: translateX(var(--transaleX-End));
		}
	}
	@keyframes txtSpan {
		0% {
			right: 0px;
		}
		15% {
			right: 40px;
		}

		90% {
			right: 40px;
		}
		100% {
			right: 0%;
		}
	}
	@keyframes bg {
		0% {
			transform-origin: var(--transform-origin-Start);
			transform: translateX(0) scale3d(var(--scale3d-x-Start), 1, 1);
		}
		20% {
			transform-origin: var(--transform-origin-Start);
			transform: translateX(0) scale3d(var(--scale3d-x-Start), 1, 1);
		}

		50% {
			transform-origin: var(--transform-origin-Start);
			transform: translateX(0) scale3d(var(--scale3d-x-Mid), 1, 1);
		}

		80% {
			transform-origin: var(--transform-origin-Start);
			transform: translateX(var(--transaleX-End)) scale3d(var(--scale3d-x-End), 1, 1);
		}
		100% {
			transform-origin: var(--transform-origin-Start);
			transform: translateX(var(--transaleX-End)) scale3d(var(--scale3d-x-End), 1, 1);
		}
	}
</style>
