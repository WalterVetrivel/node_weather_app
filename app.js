const { getLocation } = require('./utils/location');
const { getCurrentWeather } = require('./utils/weather');

const app = (address, isIp) => {
	getLocation(address, isIp, (err, { place_name, coordinates } = {}) => {
		if (err) {
			return console.error(err);
		}

		console.log(`Location: ${place_name}`);

		getCurrentWeather(
			coordinates,
			(err, { weather_descriptions, temperature, feelslike } = {}) => {
				if (err) {
					return console.error(err);
				}

				console.log(
					`It is currently ${weather_descriptions[0]}.\nThe temperature is ${temperature} degrees.\nIt feels like ${feelslike} degrees.`
				);
			}
		);
	});
};

if (process.argv.length < 3) {
	const publicIp = require('public-ip');
	(async () => {
		const ip = await publicIp.v4();
		app(ip, true);
	})();
} else {
	app(process.argv[2], false);
}
