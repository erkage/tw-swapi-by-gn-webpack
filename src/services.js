
const swapiUrl = "https://swapi.dev/api";

export default {
	async getSwapiPeoplePage(page = 1) {
		try {
			const response = await fetch(`${swapiUrl}/people/?page=${page}`);
			return await response.json();
		} catch (error) {
			console.error("[getSwapiPeoplePage]", error.message);
			throw error;
		}
	},
	async getAllSwapiPeople() {
		let people;

		try {
			//get first page
			const response = await this.getSwapiPeoplePage();
			people = response;
			const { count, perPageCount } = {
				count: people.count,
				perPageCount: people.results.length
			};

			const numberOfPagesLeft = Math.ceil((count - 1) / perPageCount);
			const promises = [];
			for (let i = 2; i <= numberOfPagesLeft; i++) {
				promises.push(this.getSwapiPeoplePage(i));
			}
			const responses = await Promise.all(promises).then(responses => {
				return responses;
			}).catch(error => {
				console.error("[getAllSwapiPeople]", error.message);
				throw error;
			});
			people = responses.reduce((acc, data) => [...acc, ...data.results], people.results);
			return people;
		} catch (error) {
			console.error("[getAllSwapiPeople]", error.message);
			throw error;
		}
	},
	async getSwapiPlanet(planetId) {
		try {
			const response = await fetch(`${swapiUrl}/planets/${planetId}`);
			return await response.json();
		} catch (error) {
			return console.error(error);
		}
	},
};
