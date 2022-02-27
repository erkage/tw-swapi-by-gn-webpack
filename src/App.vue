<template>

	<h2>TW-SWAPI <i>by GáborNémeth</i></h2>

	<div id="header">
		<input id="search" v-model="state.search" type="text" placeholder="Search name" autocomplete="off">
		<DarkModeToggle />
	</div>

	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th 
						v-for="column in peopleColumns" 
						:key="column.name" 
						:class="column.name"
						@click="sortBy(column.name, column.type)"
					>
						{{ column.label }}
						<transition name="fade">
							<img 
								v-if="state.sortBy === '' || state.sortBy === column.name" 
								:src="require('@/assets/icons/sort_icon' + sortIcon + '.svg')"
							>
						</transition>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="state.loading">
					<td class="loading" colspan="6">
						<LoadingAnim />
					</td>
				</tr>
				<tr v-if="state.error">
					<td class="error" colspan="6">
						<p>Can't load People data: "{{ state.error }}"</p>
					</td>
				</tr>
				<tr v-for="person in filteredPeople" :key="person.name">
					<td 
						v-for="column in peopleColumns" 
						:key="column.name" 
						:class="column.name"
					>
						<template v-if="column.type === 'd'"> {{ convertDate(person[column.name]) }} </template>
						<template v-else-if="column.name === 'homeworld'">
							<span @click="openPlanetInfo(person[column.name])">{{ person[column.name] }}</span>
						</template>
						<template v-else> {{ person[column.name] }} </template>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<PlanetModal 
		:show="state.modal.show"
		:planetData="state.modal.data"
		@close="closePlanetInfo"
	/>

	<div id="ts-yellow" class="tatooine-sun"></div>
	<div id="ts-red" class="tatooine-sun"></div>
</template>


<script setup>
	import { reactive, onBeforeMount, computed } from "vue"

	import Services from "@/services"
	import { peopleColumns } from "@/columns"

	import PlanetModal from "./components/PlanetModal.vue";
	import LoadingAnim from "./components/LoadingAnim.vue";
	import DarkModeToggle from "./components/DarkModeToggle.vue";

	let peopleOriginal = [];
	const state = reactive({
		people: [],
		loading: true,
		sortBy: "",
		sortStatus: 0, // 1: asc, 2: desc, 0: none
		modal: {
			show: false,
			data: {}
		},
		search: "",
		error: ""
	});

	const getPeople = async () => {
		try {
			const people = await Services.getAllSwapiPeople();
			state.people = people;
			peopleOriginal = [...state.people];
		} catch (error) {
			console.error("[getPeople]", error.message);
			state.error = error.message;
		}
		state.loading = false;
	};

	const convertDate = date => {
		return new Date(date).toLocaleString("en-IE");
	};

	const openPlanetInfo = async planetUrl => {
		state.modal.show = true;
		const resp = await Services.getSwapiPlanet(getPlanetId(planetUrl));
		if (resp){
			state.modal.data = resp;
		}
		else {
			console.error(resp);
		}
	};
	const closePlanetInfo = () => {
		state.modal.show = false;
		state.modal.data = {};
	};
	const getPlanetId = planetUrl => {
		// also can be done with 2 regexp replace
		return +planetUrl.slice(0, -1).split('/').pop();
	};

	/* SORT AND FILTERING */

	const sortIcon = computed(() => {
		return state.sortStatus === 0 ? "" : state.sortStatus === 1 ? "_up" : "_down";
	});
	
	const sortBy = (col, type) => {
		if (state.sortBy === "" || state.sortBy !== col) {
			state.sortStatus = 1;
			sortPeople(col, type);
			state.sortBy = col;
		}
		else if (state.sortBy === col && state.sortStatus !== 2) {
			state.sortStatus = state.sortStatus + 1;
			sortPeople(col, type);
			state.sortBy = col;
		}
		else {
			state.sortBy = "";
			state.sortStatus = 0;
			state.people = [...peopleOriginal];
		}
	};

	const sortPeople = (col, type) => {
		state.people.sort((a, b) => {
			if (state.sortBy === col){
				[a, b] = [b, a];
			}
			switch (type) {
				case "n":
					return (b[col] === "unknown") 
						? -1 
						: +a[col].replace(",", "") - +b[col].replace(",", "");
				case "d":
					return new Date(a[col]) - new Date(b[col]);
				case "s":
					return a[col].localeCompare(b[col]);
				case "u":
					return getPlanetId(a[col]) - getPlanetId(b[col]);
				default:
					return 0;
			}
		});
	};

	const filteredPeople = computed(() => {
		return state.people.filter(person => {
			return person.name.toLowerCase().includes(state.search.toLowerCase());
		});
	})
	
	onBeforeMount(() => {
		setTimeout(getPeople, 0);
	});

</script>

<style lang="scss">
	* {
		border: 0 solid;
		box-sizing: border-box;
	}

	html {
		background-color: #fffaf0;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #1e2b38;
		padding: 30px;

		#search {
			color: #111827;
			font-size: 14px;
			background-color: #fafafa;
			border: 1px solid #d1d5db;
			border-radius: 4px;
			display: block;
			width: 200px;
			padding: 10px;

			&::placeholder {
				color: #6b7280;
			}
		}

		h2 {
			text-align: center;
			padding-bottom: 25px;
			position: relative;
			z-index: 1;
		}

		#header {
			position: relative;
			width: 100%;
			max-width: 1200px;
			margin: 0 auto;
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			background-color: rgba(255, 254, 251, 0.97);
			z-index: 1;
			display: flex;
			justify-content: space-between;
			padding: 10px;
			box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);
		}

		.table-wrap {
			width: 100%;
			overflow-x: auto;
			max-width: 1200px;
			margin: 0 auto;
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			background-color: rgba(255, 254, 251, 0.97);
			position: relative;
			z-index: 1;
			box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);

			table {
				width: 100%;
				border-collapse: collapse;

				thead {
					background-color: #f9f9f9;
				}

				th {
					padding: 11px 10px 11px 10px;
					position: relative;
					text-align: left;
					border-bottom: 1px solid #eee;
					cursor: pointer;

					&.homeworld {
						min-width: 260px;
						width: 260px;
					}
					&.name {
						min-width: 200px;
						width: 200px;
					}
					&.created,
					&.edited {
						min-width: 180px;
						width: 180px;
					}
					&.height,
					&.mass {
						min-width: 85px;
						width: 85px;
					}

					img {
						width: 14px;
						position: absolute;
						margin: auto;
						top: 0;
						bottom: 0;
						right: 10px;
					}
				}

				td {
					padding: 20px 10px 20px 10px;
					text-align: left;
					border-bottom: 1px solid #eee;

					span {
						text-decoration: underline dotted;
						cursor: pointer;
						transition: color 0.3s ease;

						&:hover {
							color: #1e588b;
						}
					}

					&.name {
						font-weight: 500;
					}

					&.loading,
					&.error {
						border-bottom: none;
						text-align: center;

						img {
							position: relative;
						}
					}
					&.error {
						color: #c8483c;
						font-weight: 500;
					}
				}
			}
		}

		.tatooine-sun {
			position: fixed;
			width: 130px;
			height: 130px;
			border-radius: 50%;
			z-index: 0;
		}
		#ts-yellow {
			top: 50px;
			right: 18vw;
			background: #fffaa8;
			border: 5px solid #f5eb71;
		}
		#ts-red {
			top: 210px;
			right: 10vw;
			background: #ed5d4d;
			border: 5px solid #c8483c;
		}
	}

	/* MOBILE ADJUSTING */

	@media only screen and (max-width: 600px) {
		#app {
			padding: 18px;

			h2 {
				text-shadow: #a9adb3 0px 0px 3px;
			}

			.table-wrap table td.loading {
				text-align: left;
			}

			#search {
				//prevent iOS zoom when tap on input field
				font-size: 16px;
			}

			#ts-red {
				right: 0%;
			}
		}
	}

	/* DARK MODE */

	html.dark {
		background-color: #111827;

		#app {
			color: #efefef;

			#search {
				background-color: #374151;
				color: #efefef;
				border-color: #4b5563;

				&::placeholder {
					color: #9ca3af;
				}
			}

			#modal {
				color: #efefef;
				background-color: rgba(17, 24, 39, 0.8);

				.wrap {
					background-color: #1f2937;
				}
			}

			h2 {
				color: #fff;
			}

			.loading-anim {
				filter: drop-shadow(0rem 0rem 0.1rem #b8b8b8);
			}

			#header {
				background-color: rgba(31, 41, 55, 0.94);
			}

			.table-wrap {
				background-color: rgba(31, 41, 55, 0.94);

				thead {
					background-color: #374151;
				}

				th, td {
					border-color: #374151;
				}
			}
		}
	}

	/* ANIMATION */

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.2s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
