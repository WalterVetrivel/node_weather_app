const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const getCurrentWeather = ({ lat, lng }, callback) => {
	const url = `/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${lat},${lng}&units=m`;

	request(
		{ baseUrl: process.env.WEATHERSTACK_URL, url, json: true },
		(err, res) => {
			if (err) {
				callback('Unable to get weather information.');
			} else if (res.body.error) {
				callback('Unable to find location.');
			} else {
				const data = res.body;
				callback(undefined, data.current);
			}
		}
	);
};

module.exports = { getCurrentWeather };
