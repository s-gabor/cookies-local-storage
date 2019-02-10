const urlBase = 'https://api.wunderground.com/api/cfbfc5f603141e07/conditions/q/RO/';
let urlCity = 'Cluj-Napoca';
const temp = document.getElementById('temperature');


const loadData = (degreePref) => {
	fetch(urlBase + urlCity + '.json')
		.then(response => response.json())
		.then(res => {
			if (degreePref === 'Celsius') {
				temp.innerHTML = `${res.current_observation.display_location.city}: ${res.current_observation.dewpoint_c} ${degreePref} degrees!`;
			} else {
				temp.innerHTML = `${res.current_observation.display_location.city}: ${res.current_observation.dewpoint_f} ${degreePref} degrees!`;
			}
		})
		.catch(err => {
			temp.innerHTML = `I can\'t find "${urlCity.toUpperCase()}"!`
		})
} 


const checkCookies = () => {
	let degreePref;// = 'Celsius'; // default value if no user prefference in cookies
	let cookiesList = document.cookie.split('; ');
	// update degree prefference if found in cookies
	for (let cookie of cookiesList) {
		let key, value;
		[key, value] = cookie.split('=');
		if (key === 'degree') {
			degreePref = value;
			document.getElementById('cookies').innerHTML = 'In cookies: ' + value;
		}
	}
	return degreePref;
}


const checkLocalStorage = () => {
	let degreePref;// = 'Celsius'; // default value if no user prefference in local storage
	// update degree prefference if found in local storage
	let degree = localStorage.getItem('degree');
	if (degree) {
		degreePref = degree;
	}
	document.getElementById('local-storage').innerHTML = 'In local storage: ' + degree;
	return degreePref;
}


const displayTemperature = () => {
	let degreePref;
	const degreePrefCookies = checkCookies();
	const degreePrefLocalStorage = checkLocalStorage();
	if (degreePrefCookies) {
		degreePref = degreePrefCookies;
		console.log('User degree prefference found in cookies.');
	} else if (degreePrefLocalStorage) {
		degreePref = degreePrefLocalStorage;
		console.log('User degree prefference found in local storage.');
	} else {
		degreePref = 'Celsius';
	}
	loadData(degreePref);
}


window.addEventListener('DOMContentLoaded', displayTemperature);


// update degree value in cookies on user interaction
document.getElementById('preference').addEventListener('change', (event) => {
	document.cookie = `degree=${event.target.value}`;
	localStorage.setItem('degree', event.target.value);
	displayTemperature();
})


// load data for a different city or Cluj-Napoca if the input field is empty
document.getElementById('city').addEventListener('keyup', (event) => {
	(event.target.value) ? urlCity = event.target.value : urlCity = 'Cluj-Napoca';
	displayTemperature();
})
