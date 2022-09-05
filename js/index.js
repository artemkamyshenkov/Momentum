const time = document.querySelector(".time");
const onlyDate = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const greetingContainer = document.querySelector(".greeting-container");
const greetingText = document.querySelector(".name");
const body = document.querySelector("body");
const date = new Date();
const timeOfDay = getTimeOfDay();
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");
const hours = date.getHours();

// Time and date
function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString("en-US", { hour12: false });
  time.textContent = currentTime;

  function showDate() {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const currentDate = date.toLocaleDateString("en-US", options);
    onlyDate.textContent = currentDate;
  }
  showDate();
  setTimeout(showTime, 1000);
}
showTime();
//Greeting
function getTimeOfDay() {
  const hours = date.getHours();
  let message;
  if (hours >= 6 && hours < 12) message = "morning";
  if (hours >= 12 && hours < 18) message = "afternoon";
  if (hours >= 18 && hours < 24) message = "evening";
  if (hours >= 00 && hours < 6) message = "night";
  return message;
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  greeting.textContent = `Good ${timeOfDay},`;
}
showGreeting();

//Greeting name
function setLocalStorage() {
  localStorage.setItem("greetingText", greetingText.value);
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("greetingText")) {
    greetingText.value = localStorage.getItem("greetingText");
  }
}
window.addEventListener("load", getLocalStorage);

//Background
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let randomNum = getRandomNum(1, 20);
function setBg() {
  const timeOfDay = getTimeOfDay();
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/artemkamyshenkov/stage1-tasks/assets/images/${timeOfDay}/${randomNum
    .toString()
    .padStart(2, "0")}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}
setBg();
//Slider

const getSlideNext = () => {
  randomNum = randomNum !== 20 ? randomNum + 1 : 1;
  setBg();
};

function getSlidePrev() {
  randomNum = randomNum !== 1 ? randomNum - 1 : 20;
  setBg();
}
slidePrev.addEventListener("click", getSlidePrev);
slideNext.addEventListener("click", getSlideNext);

//Weather
const weather = document.querySelector(".weather");
const city = document.querySelector(".city");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const weatherError = document.querySelector(".weather-error");
let lang = "en";

async function getWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=f127ab889112401c5200a14bedf4dfdb&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
    wind.textContent = `Windspeed: ${data.wind.speed} м/с`;
  } catch (err) {
    weatherError.textContent = `Error ${city.value} is not defined`;
  }
}

function setWeather(e) {
  if (e.type === "keypress") {
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("city", e.target.innerText);
      city.blur();
    }
  } else {
    localStorage.setItem("city", e.target.innerText);
  }
}

city.addEventListener("keypress", setFocus);
city.addEventListener("blur", setFocus);

city.addEventListener("change", () => {
  getWeather();
  location.reload();
});

function setLocalStorageWeather() {
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorageWeather);

function getLocalStorageWeather() {
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  }
  getWeather();
}
window.addEventListener("load", getLocalStorageWeather);

//Player
const player = document.querySelector(".player");
const playerControls = document.querySelector(".player-controls");
const playBtn = document.querySelector(".play");
const prevBtn = document.querySelector(".play-prev");
const nextBtn = document.querySelector(".play-next");
const pauseBtn = document.querySelector(".pause");
const progressContainer = document.querySelector(".progress__container");
const progress = document.querySelector(".progress");
const audio = document.querySelector(".audio");
const playItem = document.querySelector(".play-item");
const audioTitle = document.querySelector(".audio-title");
const audioCurrentTime = document.querySelector(".audio-time");
const audioDuration = document.querySelector(".audio-duration");
const audioRange = document.querySelector(".range");
const volumeSlider = document.querySelector(".volume-slider");
const audioOff = document.querySelector(".fa fa-volume-down");

const songs = [
  "Aqua Caelestis",
  "Ennio Morricone",
  "River Flows In You",
  "Summer Wind",
];

let songIndex = 0;

function loadSong(song) {
  audioTime();
  audioTitle.innerHTML = song;
  audio.innerHTML = player;
  audio.src = `./assets/sounds/${song}.mp3`;
}
loadSong(songs[songIndex]);

function playAudio() {
  player.classList.add("stop");
  playItem.classList.add("item-active");
  playBtn.classList.add("pause");
  audio.play();
}

function pauseAudio() {
  player.classList.remove("stop");
  playItem.classList.remove("item-active");
  playBtn.classList.remove("pause");
  audio.pause();
}

playBtn.addEventListener("click", () => {
  const isPlaying = player.classList.contains("stop");
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
});

function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playAudio();
}

function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playAudio();
}
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPersent = (currentTime / duration) * 100;
  progress.style.width = `${progressPersent}%`;
}

audio.addEventListener("timeupdate", updateProgress);

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", nextSong);

function audioTime() {
  setTimeout(() => {
    audioDuration.textContent = formatTime(audio.duration);
  }, 300);
}
const formatTime = (time) => {
  let min = Math.floor(time / 60);
  if (min < 10) {
    min = `0${min}`;
  }
  let sec = Math.floor(time % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
};
audioTime();

//progress bar

setInterval(() => {
  progress.value = audio.currentTime;
  audioCurrentTime.textContent = formatTime(audio.currentTime);
}, 500);

function setVolume() {
  audio.volume = volumeSlider.value / 100;
}
setVolume();

const volumeOff = document.querySelector(".fa-volume-down");
volumeOff.addEventListener("click", () => {
  audio.volume = 0;
});
//quotes
const quotesContainer = document.querySelector(".quotes__container");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const quotes = "data.json";
const changeQuote = document.querySelector(".change-quote");
//let indexQuotes = getRandomNum(0, 6);
let indexQuote = 0;

async function getQuotes() {
  const res = await fetch(quotes);
  const data = await res.json();

  quote.textContent = `❝ ${data.quotes[indexQuote].text} ❞`;
  author.textContent = `${data.quotes[indexQuote].author}`;
}
getQuotes();

changeQuote.addEventListener("click", () => {
  indexQuote++;
  if (indexQuote > 6) {
    indexQuote = 0;
  }
  getQuotes();
});

window.addEventListener("load", () => {
  indexQuote++;
  if (indexQuote > 6) {
    indexQuote = 0;
  }
  getQuotes();
});

//Background API
//Unsplash

async function getLinkToImageUnsplash() {
  const url =
    "https://api.unsplash.com/photos/random?query=morning&client_id=-xe8z1BYEBuBQTk-jMqe2U3eECgdj14Showo4hEm6xg";
  const res = await fetch(url);
  const data = await res.json();
  const img = new Image();
  img.src = data.urls.regular;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

//Flickr

async function getLinkToImageFlickr() {
  const url =
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f7dc0bf553814de5057f419abd57732d&tags=nature&extras=url_l&format=json&nojsoncallback=1";
  const res = await fetch(url);
  const data = await res.json();
  const img = new Image();
  img.src = data.photos.photo[1].url_l;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

//setting

const btnGitHub = document.querySelector(".github");
const btnUnsplash = document.querySelector(".unsplash");
const btnFlickr = document.querySelector(".flickr");
const btnSetting = document.querySelector(".setting");
const settingContainer = document.querySelector(".setting__container");
const btnsettingClose = document.querySelector(".setting__close");
const hiddenAudio = document.getElementById("audio__setting");
const hiddenTime = document.getElementById("time__setting");
const hiddenDate = document.getElementById("date__setting");
const hiddenkWeather = document.getElementById("weather__setting");
const hiddenQuotes = document.getElementById("quotes__setting");
const hiddenGreeting = document.getElementById("greeting__setting");
const btnEn = document.querySelector(".en");
const btnRu = document.querySelector(".ru");

btnSetting.addEventListener("click", function (e) {
  e.preventDefault();
  settingContainer.classList.toggle("open");
});
btnsettingClose.addEventListener("click", function (e) {
  e.preventDefault();
  settingContainer.classList.remove("open");
});

btnGitHub.addEventListener("click", function () {
  setBg();
});

btnUnsplash.addEventListener("click", function () {
  getLinkToImageUnsplash();
});

btnFlickr.addEventListener("click", function () {
  getLinkToImageFlickr();
});

hiddenAudio.addEventListener("click", function () {
  if (hiddenAudio.checked) {
    player.classList.add("close");
  } else {
    player.classList.remove("close");
  }
});

hiddenkWeather.addEventListener("click", function () {
  if (hiddenkWeather.checked) {
    weather.classList.add("close");
  } else {
    weather.classList.remove("close");
  }
});

hiddenTime.addEventListener("click", function () {
  if (hiddenTime.checked) {
    time.classList.add("close");
  } else {
    time.classList.remove("close");
  }
});

hiddenDate.addEventListener("click", function () {
  if (hiddenDate.checked) {
    onlyDate.classList.add("close");
  } else {
    onlyDate.classList.remove("close");
  }
});

hiddenQuotes.addEventListener("click", function () {
  if (hiddenQuotes.checked) {
    quotesContainer.classList.add("close");
  } else {
    quotesContainer.classList.remove("close");
  }
});

hiddenGreeting.addEventListener("click", function () {
  if (hiddenGreeting.checked) {
    greetingContainer.classList.add("close");
  } else {
    greetingContainer.classList.remove("close");
  }
});

//Focus

const focusContainer = document.querySelector(".focus-container");
const focusArea = document.querySelector(".focus-area");
const focusTitle = document.querySelector(".focus-title");

function setFocus(e) {
  if (e.type === "keypress") {
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("focusArea", e.target.innerText);
      focusArea.blur();
    }
  } else {
    localStorage.setItem("focusArea", e.target.innerText);
  }
}
focusArea.addEventListener("keypress", setFocus);
focusArea.addEventListener("blur", setFocus);
function setFocusLocalStorage() {
  localStorage.setItem("focusArea", focusArea.value);
}
window.addEventListener("beforeunload", setFocusLocalStorage);

function getFocusLocalSrorage() {
  if (localStorage.getItem("focusArea")) {
    focusArea.value = localStorage.getItem("focusArea");
  }
}
window.addEventListener("load", getFocusLocalSrorage);

btnRu.addEventListener("click", function () {
  let messageRu;
  if (hours >= 6 && hours < 12) messageRu = "morning";
  if (hours >= 12 && hours < 18) messageRu = "afternoon";
  if (hours >= 18 && hours < 24) messageRu = "Добрый вечер,";
  if (hours >= 00 && hours < 6) messageRu = "Доброй ночи,";
  greeting.textContent = `${messageRu}`;
  focusTitle.textContent = "Ваша главная цель на сегодня ?";
  focusArea.placeholder = "введите цель";
  greetingText.placeholder = "введите имя";
});

// btnEn.addEventListener("click", () => {
//   showGreeting;
// });

btnEn.addEventListener("click", showGreeting);
