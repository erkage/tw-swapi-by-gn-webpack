<template>
	<div @click="darkMode = !darkMode">
		<img v-if="darkMode" src="@/assets/icons/saber_green_jedi.svg">
		<img v-else src="@/assets/icons/saber_red_sith.svg">
	</div>
</template>

<script setup>
	import { ref, watch } from "vue"

	const darkMode = ref(false);

	watch(
		darkMode, 
		(darkMode) => {
			document.documentElement.classList.toggle("dark", darkMode);
		}
	);

</script>

<style lang="scss" scoped>

	div {
		display: flex;

		img {
			width: 28px;
			margin-right: 10px;
			cursor: pointer;
			transition: filter 0.3s;

			&:hover {
				filter: drop-shadow(0rem 0rem 0.2rem #bf1e1e);
			}
	}
	}
	.dark {
		img {
			&:hover {
				filter: drop-shadow(0rem 0rem 0.2rem #1ebf1e);
			}
		}
	}
</style>