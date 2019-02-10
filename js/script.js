const urlBase = 'https://api.wunderground.com/api/cfbfc5f603141e07/conditions/q/RO/';
let urlCity = 'Cluj-Napoca';
const temp = document.getElementById('temperature');
// TO DO: 
// Is is better to declare degreePref here as global variable?
// and remove it's declaration from checkCookie, checkLocalStorage and displayTemperature
// and remove the param from loadData
// and remove the return statements from checkCookie and checkLocalStorage 
// --> functions will update the global degreePref.


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
	let degreePref;
	let cookiesList = [];
	cookiesList = document.cookie.split('; ');
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
	let degreePref, degree;
	degree = window.localStorage.getItem('degree');
	// update degree prefference if found in local storage
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
	} else if (degreePrefLocalStorage) {
		degreePref = degreePrefLocalStorage;
	} else {
		degreePref = 'Celsius';
	}
	loadData(degreePref);
}


window.addEventListener('DOMContentLoaded', displayTemperature);


// update degree value in cookies on user selection
document.getElementById('preference').addEventListener('change', (event) => {
	document.cookie = `degree=${event.target.value}`;
	window.localStorage.setItem('degree', event.target.value);
	displayTemperature();
})


// load data for a different city or Cluj-Napoca if the input field is empty
document.getElementById('city').addEventListener('keyup', (event) => {
	(event.target.value) ? urlCity = event.target.value : urlCity = 'Cluj-Napoca';
	displayTemperature();
})
