const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const getLocationFromAddressData = data => {
	const coordinatesArray = data.features[0].center;
	return {
		place_name: data.features[0].place_name,
		coordinates: { lat: coordinatesArray[1], lng: coordinatesArray[0] },
	};
};

const getLocationFromIpData = data => {
	return {
		place_name: `${data.city}, ${data.region_name}, ${data.country_name}`,
		coordinates: { lat: data.latitude, lng: data.longitude },
	};
};

const getBaseUrl = isIp =>
	isIp ? process.env.IPSTACK_URL : process.env.MAPBOX_URL;

const getConnectionUrl = (address, isIp) => {
	return isIp
		? `/${encodeURIComponent(address)}?access_key=${
				process.env.IPSTACK_API_KEY
		  }`
		: `/${encodeURIComponent(address)}.json?access_token=${
				process.env.MAPBOX_API_KEY
		  }&limit=1`;
};

const getLocation = (address, isIp, callback) => {
	const baseUrl = getBaseUrl(isIp);
	const url = getConnectionUrl(address, isIp);

	request(
		{
			baseUrl,
			url,
			json: true,
		},
		(err, res) => {
			if (err) {
				return callback('Unable to connect to location services.');
			}

			let location = {};
			const data = res.body;

			if (!isIp) {
				if (res.body.features.length === 0) {
					return callback('Unable to find location.');
				}

				location = getLocationFromAddressData(data);
			} else {
				if (res.body.error) {
					return callback(res.body.error.info);
				}

				location = getLocationFromIpData(data);
			}
			return callback(undefined, location);
		}
	);
};

module.exports = { getLocation };
