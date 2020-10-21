//Get Theme from LocalStorage (in case they come back to the index webpage)

let themeStorage = localStorage.getItem('theme')

function theme() {
	if (themeStorage === 'dark-theme') {
		document.body.className = themeStorage
	}
}

//Disable and Enable Search Button
let gifForm = document.getElementById('search')
gifForm.disabled = true;
let searchInput = document.getElementById('input')

searchInput.addEventListener('keyup', function (){
	let searchInput = document.getElementById('input')
	let inputValue = searchInput.value
	let contClass = document.getElementById('cont').className
	if(inputValue !== ""){
		gifForm.removeAttribute('disabled') // Enables Button for Search
		/*if(contClass === 'light-theme'){
			gifForm.style.backgroundColor = '#F7C9F3'
			gifForm.style.color = '#110038'
		} //Changes color when searching
		if(contClass ==='dark-theme'){
			gifForm.style.backgroundColor = 'none'
			gifForm.style.color = 'none'
		} //Changes color when searching*/
	} else {
		gifForm.setAttribute('disabled', null) //Disables Button
		/*if(contClass ==='light-theme'){
			gifForm.style.backgroundColor = '#E6E6E6'
			gifForm.style.color = '#B4B4B4'
		} //Changes color when searching
		if(contClass === 'dark-theme'){
			gifForm.style.backgroundColor = '#B4B4B4'
			gifForm.style.color = '#8F8F8F'
		} //Changes color when searching*/
	}
})

window.onload = theme()

//Active Dropdown Menu for choosing Light or Night Theme

function displayMenu() {
	let dropdownMenu = document.getElementById("themelist");
	if (dropdownMenu.style.display === "none") {
		dropdownMenu.style.display = "block"
	} else {
		dropdownMenu.style.display = "none"
	}
};

document.getElementById('theme').addEventListener('click', displayMenu)


// Set Night Theme

function setNightTheme() {
	document.body.className = 'dark-theme';
	let bodyTheme = document.body.className
	window.localStorage.setItem('theme', bodyTheme)
}

document.getElementById('dark').addEventListener('click', setNightTheme)

// Set Light Theme 

function setDayTheme() {
	document.body.className = 'light-theme';
	let bodyTheme = document.body.className
	window.localStorage.setItem('theme', bodyTheme)
}

document.getElementById('light').addEventListener('click', setDayTheme)


//Suggested Gifs

function getSuggestedGifs() {
	let url = 'https://api.giphy.com/v1/gifs/trending?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&offset=33&limit=4';
	let i = 0
	fetch(url)
		.then(response => response.json())
		.then(json => json.data.forEach(img => {
			let grid = document.getElementById('gifgrid')
			let gifDiv = document.createElement('div')
			gifDiv.classList.add('gif')
			let gifTitles = document.createElement('div')
			gifTitles.classList.add('gif-header')
			let titleHashtags = document.createElement('h4')
			let gifHashtags = json.data[i].title
			i++
			let splitHashtags = gifHashtags.split(' ')
			titleHashtags.textContent = '#' + splitHashtags[1]
			gifTitles.appendChild(titleHashtags)
			let closeWindow = document.createElement('img')
			closeWindow.setAttribute('src', './assets/button_close.svg')
			gifTitles.appendChild(closeWindow)
			let boxGifs = document.createElement('img')
			boxGifs.setAttribute('style', 'width: 100%')
			console.log(boxGifs)
			boxGifs.setAttribute('src', img.images.original['url'])
			let seeMore = document.createElement('div')
			seeMore.textContent = "Ver mas..."
			seeMore.classList.add('see-more')
			gifDiv.appendChild(gifTitles)
			gifDiv.appendChild(boxGifs)
			gifDiv.appendChild(seeMore)
			grid.appendChild(gifDiv)
		}))
		.catch(function (error) {
			console.log(error)
		})
}

getSuggestedGifs();

//Trending Gifs

function getGifs() {
	let url = "https://api.giphy.com/v1/gifs/trending?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&limit=20";
	let i = 0
	fetch(url)
		.then(response => response.json())
		.then(dataJson => dataJson.data.forEach(img => {
			let container = document.getElementById("gif-container");
			let div = document.createElement('div');
			div.classList.add("gif-box");
			let hashtagHover = document.createElement('div');
			hashtagHover.classList.add("gif-hashtags");
			hashtagHover.setAttribute('style', 'height: 295px');
			let gifImg = document.createElement('img');
			let title = document.createElement('h4');
			gifImg.setAttribute('src', img.images.original['url']);
			console.log(gifImg);
			div.appendChild(gifImg);
			div.appendChild(title);
			hashtagHover.appendChild(div);
			container.appendChild(hashtagHover);
			let hashtags = dataJson.data[i].title;
			let hashtagsArray = hashtags.split(' ');
			title.innerHTML = '#' + hashtagsArray[0] + ' #' + hashtagsArray[1] + ' #' + hashtagsArray[2];
			i++
		}))
		.catch(function (error) {
			console.log(error)
		})
}

getGifs();

//Get Suggested Gifs
function autoComplete() {
let searchInput = document.getElementById('input')
let inputValue = searchInput.value
	let searchTerm = inputValue.replace(' ', '+') //Replaces the spaces with an '+' because the API request it
	let suggestedGifsUrl = `http://api.giphy.com/v1/gifs/search/tags?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&q='${searchTerm}'&limit=3`
	fetch(suggestedGifsUrl)
		.then(response => response.json())
		.then(dataSearch => {
			let searchResults = document.getElementById('searchresults')
			searchResults.style.display = 'block'
			searchResults.innerHTML = ''
			if (dataSearch.data.length > 0) {
				for (let i = 0; i < 3; i++) {
					let results = document.createElement('li')
					results.className = 'results'
					searchResults.appendChild(results)
					let textResult = dataSearch.data[i].name ? dataSearch.data[i].name : null
					results.innerHTML = ''
					results.innerHTML = textResult
				}
				document.getElementsByClassName('results')[0].addEventListener('click', searchAutocomplete)
				document.getElementsByClassName('results')[0].addEventListener('click', hideAutoComplete)
				document.getElementsByClassName('results')[1].addEventListener('click', searchAutocomplete)
				document.getElementsByClassName('results')[1].addEventListener('click', hideAutoComplete)
				document.getElementsByClassName('results')[2].addEventListener('click', searchAutocomplete)
				document.getElementsByClassName('results')[2].addEventListener('click', hideAutoComplete)
			} else {
				searchResults.style.display = 'none'
			}
		})
		.catch(err => console.log(err))
}

let getValue = document.getElementById('input');
getValue.addEventListener('input', autoComplete)

//Search AutoComplete Results
function searchAutocomplete(e) {
	let textResult = e.target.innerHTML
	let tagsContainer = document.getElementById('tags-cont')
	tagsContainer.innerHTML = ""
	let url = `https://api.giphy.com/v1/gifs/search?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&q=${textResult}&limit=20` //Fetch API w/ the Suggested Values
	fetch(url)
		.then(response => response.json())
		.then(response => {
			let dataObject = response.data
			showGifs(dataObject) //Calling Function showGifs
		})
		.then(response => {
			let relatedSearchUrl = `http://api.giphy.com/v1/gifs/search/tags?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&q='${textResult}'&limit=3`
			fetch(relatedSearchUrl)
			.then(response => response.json())
			.then(relatedTagsJson => {
					for (let i = 0; i < 3; i++){
						let relatedTags = document.createElement('div')
						relatedTags.className	= 'tags'
						tagsContainer.appendChild(relatedTags)
						let tagText = relatedTagsJson.data[i].name
						relatedTags.innerHTML = '#' + tagText
					}
			})
		})
		.then(response =>{
			let trendingContainer = document.getElementById('trending')
			trendingContainer.innerHTML = ""  
			trendingContainer.innerHTML = `Resultado de búsqueda para ${textResult}`
			trendingContainer.className = 'suggestions'
		})
		.catch(err => console.log(err))
}

//Hide AutoComplete when Searching
function hideAutoComplete() {
	let searchResults = document.getElementById('searchresults')
	searchResults.style.display = 'none'
}

//Search Gifs Endpoint

function searchGifs(){
	let searchInput = document.getElementById('input')
	let inputValue = searchInput.value
	let searchTerm = inputValue.replace(' ', '+') //Replaces the spaces with an '+' because the API request it
	let tagsContainer = document.getElementById('tags-cont')
	tagsContainer.innerHTML = ""
	let url = `https://api.giphy.com/v1/gifs/search?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&q=${searchTerm}&limit=20`
	fetch(url)
	.then(response => response.json())
	.then(response => {
		let dataObject = response.data
		showGifs(dataObject) //Calling Function showGifs
	})
	.then(response => {
			let relatedSearchUrl = `http://api.giphy.com/v1/gifs/search/tags?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&q='${searchTerm}'&limit=3`
			fetch(relatedSearchUrl)
			.then(response => response.json())
			.then(relatedTagsJson => {
					for (let i = 0; i < relatedTagsJson.data.length; i++){
						let relatedTags = document.createElement('div')
						relatedTags.className	= 'tags'
						tagsContainer.appendChild(relatedTags)
						let tagText = relatedTagsJson.data[i].name
						relatedTags.innerHTML = '#' + tagText
					}
			})
		})
		.then(response => {
			let trendingContainer = document.getElementById('trending')
			trendingContainer.innerHTML = ""  
			trendingContainer.innerHTML = `Resultado de búsqueda para ${searchTerm}`
			trendingContainer.className = 'suggestions'
		})
}

gifForm.addEventListener('click', searchGifs)
gifForm.addEventListener('click', hideAutoComplete) //Hide AutoComplete Form


function fetchGifs() {
	let container = document.getElementById("gif-container");
	container.innerHTML = ""; //Deletes everything that was inside the '#gif-container' div
	let i = 0
	let url = `https://api.giphy.com/v1/gifs/search?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi&q=${searchTerm}&limit=20`
	fetch(url)
		.then(response => response.json())
		.then(response => {
			let dataObject = response.data
			showGifs(dataObject)
		})
		.catch(err => console.log(err))

}

function showGifs(dataObject) {
	let container = document.getElementById("gif-container");
	container.innerHTML = ""; //Deletes everything that was inside the '#gif-container' div
	let i = 0
	let data = dataObject
	dataObject.forEach(img => {
		let div = document.createElement('div');
		div.classList.add("gif-box");
		let hashtagHover = document.createElement('div');
		hashtagHover.classList.add("gif-hashtags");
		hashtagHover.setAttribute('style', 'height: 295px');
		let gifImg = document.createElement('img');
		let title = document.createElement('h4');
		gifImg.setAttribute('src', img.images.original['url']);
		console.log(gifImg);
		div.appendChild(gifImg);
		div.appendChild(title);
		hashtagHover.appendChild(div);
		container.appendChild(hashtagHover);
		let hashtags = data[i].title;
		let hashtagsArray = hashtags.split(' ');
		title.innerHTML = '#' + hashtagsArray[0] + ' #' + hashtagsArray[1] + ' #' + hashtagsArray[2]
		i++
	})

	
}

