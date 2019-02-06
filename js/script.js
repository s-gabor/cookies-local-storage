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
	let degreePref = 'Celsius'; // default value if no user prefference in cookies
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
	let degreePref = 'Celsius'; // default value if no user prefference in local storage
	// update degree prefference if found in local storage
	let degree = localStorage.getItem('degree');
	if (degree) {
		degreePref = degree;
	}
	document.getElementById('local-storage').innerHTML = 'In local storage: ' + degree;
	return degreePref;
}


const displayTemperature = () => {
	// get user degree prefference from cookies
	const degreePrefCookies = checkCookies();
	// get user degree prefference from local storage
	const degreePrefLocalStorage = checkLocalStorage();
	loadData(degreePrefCookies);
}


window.addEventListener('DOMContentLoaded', displayTemperature);


// update degree value in cookies on user interaction
document.getElementById('preference').addEventListener('change', (event) => {
	document.cookie = `degree=${event.target.value}`;
	localStorage.setItem('degree', event.target.value);
	displayTemperature();

	console.log('Client side data:');
	console.log('Cookies: ', document.cookie);
	console.log('Local Storage: ', localStorage);
	console.log('');
})


// load data for a different city or Cluj-Napoca if the input field is empty
document.getElementById('city').addEventListener('keyup', (event) => {
	(event.target.value) ? urlCity = event.target.value : urlCity = 'Cluj-Napoca';
	displayTemperature();
})



// const setCookie = (cname, cvalue, extraMinnutes) => {
// 	let date = new Date();
// 	date.setTime(date.getTime() + (extraMinnutes * 60 * 1000));
// 	let expires = date.getTime();
// 	document.cookie = `${cname}=${cvalue}; expires=${expires}`;
// }

// const deleteCookie = (cname, cvalue, now=new Date()) => {
// 	document.cookie = `${cname}=${cvalue}; expires=${now}`;
// 	console.log(document.cookie);
// }
