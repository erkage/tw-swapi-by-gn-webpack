<template>
	<transition appear name="fade">
		<div
			id="modal"
			aria-modal="true"
			role="dialog"
			v-show="props.show"
			@click.self="closeModal"
		>
			<div class="wrap">
				<LoadingAnim v-if="loading" />
				<template v-else-if="props.planetData.name">
					<div class="header">
						<h3 class="text-xl font-medium text-gray-900 dark:text-white">
							Planet: {{ props.planetData.name }}
						</h3>
						<button
							type="button"
							class="close"
							@click="closeModal"
						>
							<img src="@/assets/icons/close.svg" alt="close">
						</button>
					</div>

					<div class="content">
						<ul>
							<li 
								v-for="column in planetColumns" 
								:key="column.name"
							>
								<span>{{ column.label }}:</span> {{ props.planetData[column.name] }}
							</li>
						</ul>
					</div>
				</template>
			</div>
		</div>
	</transition>
</template>

<script setup>
	import { defineProps, defineEmits, ref, watch } from "vue"
	import LoadingAnim from "./LoadingAnim.vue";

	import { planetColumns } from "@/columns"

	const props = defineProps({
		planetData: {
			type: Object,
		},
		show: {
			type: Boolean,
		},
	});

	const loading = ref(true);
	watch(
		() => props.planetData, 
		(planetData) => {
			if (Object.keys(planetData).length > 0) {
				//just for demo purposes
				setTimeout(() => {
					loading.value = false;
				}, 400);
			}
			else {
				setTimeout(() => {
					loading.value = true;
				}, 500);
			}
		}
	);

	const emit = defineEmits(["close"]);
	const closeModal = () => {
		emit("close");
	};

	document.addEventListener("keydown", (e) => {
		if (e.key === 'Escape') {
			closeModal();
		}
	});

</script>

<style lang="scss" scoped>

	#modal {
		overflow-y: auto;
		overflow-x: hidden;
		position: fixed;
		inset: 0 0 0 0;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		top: -30%;
		transition: 0.3s;
		background-color: rgba(0, 0, 0, .4);

		.wrap {
			width: 650px;
			max-width: 95vw;
			min-height: 200px;
			position: relative;
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20px;
			border-bottom: 1px solid #e5e7eb;
			border-top-left-radius: 4px;
			border-top-right-radius: 4px;

			h3 {
				padding: 0;
				margin: 0;
				font-size: 1.25rem;
			}

			button {
				display: inline-flex;
				padding: 0.375rem;
				font-size: 0.875rem;
				line-height: 1.25rem;
				display: inline-flex;
				align-items: center;
				border-radius: 0.5rem;
				background-color: transparent;
				margin-left: auto;
				color: #9ca3af;

				&:hover {
					cursor: pointer;
					background-color: #e5e7eb;
					color: #111827;
				}

				img {
					width: 20px;
					height: 20px;
				}
			}
		}
		.content {
			padding: 20px 20px 25px 20px;

			ul {
				list-style: none;
				padding: 0;
				margin: 0;
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-gap: 20px;

				li {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10px;
					border-bottom: 1px solid #e5e7eb;

					span {
						font-size: 1rem;
						font-weight: 500;
						color: #9ca3af;
					}
				}
			}
		}
	}

	.dark #modal {

		.header {
			border-color: #687281;

			button:hover {
				background-color: #374151;
			}
		}
		.content ul li {
			border-color: #374151;
		}
	}

</style>
