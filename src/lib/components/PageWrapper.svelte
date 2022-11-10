<script>
	import { hide } from "$lib/animations/hide"
</script>

<section in:hide={{delay: 2000}}>
    <slot />
</section>

<style>
    section{
        height: 100%;
    }
</style>