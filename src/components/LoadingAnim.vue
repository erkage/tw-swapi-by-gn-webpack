<template>
	<img class="loading-anim" src="@/assets/icons/bb8.svg" alt="loading in progress">
</template>

<script setup>

</script>

<style lang="scss" scoped>
	img {
		width: 30px;
		animation: bb8 1s ease-in-out infinite alternate;
		position: absolute;
		inset: 0;
		margin: auto;
	}

	@media only screen and (max-width: 600px) {
		img {
			left: calc(50vw - 50px);
		}
	}
	@keyframes bb8 {
		from {
			transform: translateX(-30px);
		}
		to {
			transform: translateX(30px);
		}
	}
</style>