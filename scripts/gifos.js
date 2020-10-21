window.onload = theme();

//Get Theme from Local Storage 

function theme() {
    let themeStorage = localStorage.getItem('theme')
    if (themeStorage === 'dark-theme') {
        document.body.className = themeStorage
    }
}

//Active Dropdown Menu for choosing Light or Night Theme
function showMenu() {
    let dropdownMenu = document.getElementById("themelist");
    if (dropdownMenu.style.display === "none") {
        dropdownMenu.style.display = "block"
    } else {
        dropdownMenu.style.display = "none"
    }
}

document.getElementById('theme').addEventListener('click', showMenu) //Event Listener activating showMenu()

//Set Night Theme 

function setNightTheme() {
    document.body.className = 'dark-theme';
    let bodyTheme = document.body.className
    window.localStorage.setItem('theme', bodyTheme)
}

document.getElementById('dark').addEventListener('click', setNightTheme) //Event Listener activating setNightTheme()

//Set Day Theme

function setDayTheme() {
    document.body.className = 'light-theme';
    let bodyTheme = document.body.className
    window.localStorage.setItem('theme', bodyTheme)
}

document.getElementById('light').addEventListener('click', setDayTheme) //Event Listener activating setDayTheme()

//Active Create Gifos Button

function activeGifos() {
    let startGifos = document.getElementById('create')
    startGifos.style.display = "block"
}

document.getElementById('createbutton').addEventListener('click', activeGifos) //Event Listener activating activeGifos()

//Display Arrow SVG that allows us to go back to index.html

function displayArrow() {
    let startGifos = document.getElementById('arrow')
    startGifos.style.display = "block"
}
document.getElementById('createbutton').addEventListener('click', displayArrow) //Event Listener activating displayArrow()


//Start Making a Gif
function startGifos() {
    let checkWindow = document.getElementById('check')
    checkWindow.style.display = "block"
    let startGifos = document.getElementById('create')
    startGifos.style.display = "none"
}
document.getElementById('active').addEventListener('click', startGifos) //Event Listener activating startGifos()

//Cancel Gif Creation Process

function cancelGifos() {
    let checkWindow = document.getElementById('create')
    checkWindow.style.display = "none"
}

document.getElementById('cancel').addEventListener('click', cancelGifos) //Event Listener activating cancelGifos()

//Stream Video from Webcam

let streamObj
function getStream() {
    let video = document.getElementById('video')
    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: {
                    max: 400
                }
            }
        })
        .then(function (stream) {
            video.srcObject = stream;
            video.play()
            streamObj = stream
        })
        .catch(error => console.error(error))
}

document.getElementById('active').addEventListener('click', getStream) //Event Listener activating getStream()

//Close #Check window 

function stopStream(stream) {
    const track = stream.getTracks()
    track.forEach(function (track) {
        track.stop();
    });
}

document.getElementById('close-btn').addEventListener('click', stopStream) //Event Listener closing Window (activates stopStream())

//Open Recorder Window 

function openRecording() {
    let recorderWindow = document.getElementById('capture')
    recorderWindow.style.display = "block"
    let checkWindow = document.getElementById('check')
    checkWindow.style.display = "none"

}

document.getElementById('start').addEventListener('click', openRecording) //Event Listener activating openRecording()

//Functions using Record RTC.js

let videoWindow = document.getElementById('videocapture')

let recorder

function startRecorder() {
    videoWindow.muted = true; //Video no hace sonido
    videoWindow.volume = 0; 
    videoWindow.srcObject = streamObj;
    recorder = RecordRTC(streamObj, {
        type: 'gif'
    });
    recorder.startRecording();
    return recorder
}

document.getElementById('start').addEventListener('click', startRecorder)

//Stop the recording

function stopRecorder() {
    video.muted = true; //Video no hace sonido
    console.log("grabacion terminada")
    processRecording()
};

// Event Listener that activates stopRecorder() and hides/shows windows
document.getElementById('ready').addEventListener('click', function () {
    //this.disabled = true
    recorder.stopRecording(stopRecorder)
    let captureVideo = document.getElementById('capture')
    captureVideo.style.display = "none"
    let preview = document.getElementById("preview")
    preview.style.display = "block"
})

//Process the recording data and shows preview
function processRecording() {
    let videoGif = document.getElementById('gif-preview')
    let blob = recorder.getBlob()
    let form = new FormData();
    form.append('file', blob, 'juaniGif.gif')
    videoGif.src = URL.createObjectURL(blob); //Video tag takes as src the URL from recording
    console.log(form.get('file')) //Data from the recording logs in console
}

//Upload Gif with POST Request to GIPHY API

const controller = new AbortController(); //To Cancel Upload
const signal = controller.signal //To Cancel Upload

let urlGif;
let jsonId;
function uploadGif() {
    let form = new FormData();
    let blob = recorder.getBlob()
    form.append('file', blob, 'juaniGif.gif')
    console.log(form)
    fetch('https://upload.giphy.com/v1/gifs?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi', {
            signal, //Necessary in the Headers to enable the option of cancelling upload
            method: 'POST',
            body: form,
            json: true,
        })
        .then((response) => {
            return response.json()
        })
        .then(jsonData => {
            let gifId = jsonData.data.id
            console.log(gifId)
            fetch(`https://api.giphy.com/v1/gifs/${gifId}?api_key=e50H7kadOO3wsBzSsJ1YpQL9cEjMglfi`)
            .then(response => response.json())
            .then(dataJsonGif => {
                jsonId = dataJsonGif.data.id
                urlGif = dataJsonGif.data.images.original.url
                localStorage.setItem(jsonId, urlGif)
                console.log(urlGif)
            })
            .then(json => {
                document.getElementById('upload').style.display = 'none'
                document.getElementById('success').style.display = 'block'
                let successWindow = document.getElementById('final-wrapper')
                let gifImg = document.createElement('img')
                //gifImg.id = 'img'
                let divGif = document.createElement('div')
                divGif.classList.add('box-uploaded-gif')
                divGif.appendChild(gifImg)
                successWindow.appendChild(divGif)
                let storagedGif = localStorage.getItem(gifId)
                gifImg.setAttribute('src',storagedGif)
                let gifDiv = document.createElement('div')
                let gifBox = document.createElement('img')
                gifBox.setAttribute('src', storagedGif)
                gifDiv.appendChild(gifBox)
                let containerGifWrapper = document.getElementById('gifos-uploaded')
                containerGifWrapper.appendChild(gifDiv)
                gifDiv.classList.add('gif-box')
                let copyButton = document.getElementById('copy')
                copyButton.setAttribute('href', storagedGif)
                console.log(copyButton)  
            })
        })
        //.catch(error => console.error(error))
}

document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('preview').style.display = 'none'
    document.getElementById('upload').style.display = 'block'
    uploadGif()
});

//Load Previously Done Gifs

function loadMyGuifos(){
    let myGifsContainer = document.getElementById('gifos-uploaded')
    myGifsContainer.innerHTML = ' ';
    let gifArray = []
    for (let i = 0; i < localStorage.length; i++) {
        gifArray.push(localStorage.key(i));
    };
    if (gifArray.indexOf('theme') !== -1 ) {
        let indexGif = gifArray.indexOf('theme');
        gifArray.splice(indexGif,1)
    };
    for (let i = 0; i < gifArray.length; i++){
        let gifId = gifArray[i];
        console.log(gifId)
        let storagedUrl = localStorage.getItem(gifId)
        let gifDiv = document.createElement('div')
        let gifBox = document.createElement('img')
        gifBox.setAttribute('src', storagedUrl)
        gifDiv.appendChild(gifBox)
        let containerGifWrapper = document.getElementById('gifos-uploaded')
        containerGifWrapper.appendChild(gifDiv)
        gifDiv.classList.add('gif-box')  
    }    
}

loadMyGuifos()

//Repeat Capture  

function recordAgain() {
    let previewWindow = document.getElementById('preview')
    previewWindow.style.display = "none"
    let checkWindow = document.getElementById('check')
    checkWindow.style.display = "block"
    getStream()
}
document.getElementById('repeat-btn').addEventListener('click', recordAgain)

//Cancel Upload    
let cancelButton = document.getElementById('cancel-btn')
cancelButton.addEventListener('click', function(){
    controller.abort()
    alert('Se canceló la subida del gif al servidor de Giphy. Intentalo nuevamente!')
    document.getElementById('upload').style.display = 'none'
})

//Copy URL From Gif
let copyButton = document.getElementById('copy')
function copyGif(){
    let input = document.createElement("input");
    copyButton.appendChild(input)
    input.value = copyButton.getAttribute('href')
    input.select()
    document.execCommand('copy')
    alert('Se copió enlace al portapapeles')
    copyButton.removeChild(input)    
}

copyButton.addEventListener('click', copyGif)
//Download Gif

function downloadGif(){
    window.open(urlGif, "_blank")
    console.log("Se abrio la nueva pagina")
}

document.getElementById('download').addEventListener('click', downloadGif)

//Close Last Window with "Listo" Button

document.getElementById('done').addEventListener('click', function(){
    let lastWindow = document.getElementById('success')
    lastWindow.style.display = 'none'
     
})
