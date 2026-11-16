
// AUDIO PLAYER ELEMENTS

const audio = document.getElementById("soundtrack");
const playButton = document.getElementById("playButton");
const navSound = document.getElementById("navSound");

const wave = document.getElementById("wave");
const progress = document.getElementById("progress");
const timeline = document.getElementById("timeline");

const currentTimeLabel = document.getElementById("currentTime");
const playerHint = document.getElementById("playerHint");
const volume = document.getElementById("volume");

const MAX_PLAY_SECONDS = 75;


// FORMAT AUDIO TIMER

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}


// UPDATE PLAYING APPEARANCE

function setPlaying(isPlaying) {
  playButton.textContent = isPlaying ? "Ⅱ" : "▶";

  navSound.querySelector("span").textContent =
    isPlaying ? "Sound on" : "Sound off";

  wave.classList.toggle("playing", isPlaying);
}


// PLAY AND PAUSE

async function toggleAudio() {
  if (audio.paused) {

    if (audio.currentTime >= MAX_PLAY_SECONDS) {
      audio.currentTime = 0;
    }

    try {
      await audio.play();

      setPlaying(true);

      playerHint.textContent =
        "Take a moment. You're listening to Birzeit, Palestine.";

    } catch (error) {
      console.error("Audio playback error:", error);

      playerHint.textContent =
        "The recording could not load. Please check your audio file.";

    }

  } else {
    audio.pause();
    setPlaying(false);
  }
}


// BUTTONS

playButton.addEventListener("click", toggleAudio);
navSound.addEventListener("click", toggleAudio);


// VOLUME

audio.volume = Number(volume.value);

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});


// AUDIO LOADING CHECK

audio.addEventListener("error", () => {
  console.error("Audio file could not be found or loaded.");

  playerHint.textContent =
    "Audio unavailable. Check the audio folder and MP3 filename.";
});


// AUDIO PROGRESS

audio.addEventListener("timeupdate", () => {

  const current = Math.min(audio.currentTime, MAX_PLAY_SECONDS);

  progress.style.width =
    `${(current / MAX_PLAY_SECONDS) * 100}%`;

  currentTimeLabel.textContent = formatTime(current);


  // STOP AFTER 75 SECONDS

  if (audio.currentTime >= MAX_PLAY_SECONDS) {
    audio.pause();
    audio.currentTime = MAX_PLAY_SECONDS;

    setPlaying(false);

    playerHint.textContent =
      "A little moment from Palestine. Press play to listen again.";
  }

});


// RESET WHEN AUDIO ENDS

audio.addEventListener("ended", () => {
  setPlaying(false);
});

audio.addEventListener("pause", () => {
  setPlaying(false);
});

audio.addEventListener("play", () => {
  setPlaying(true);
});


// CLICK TIMELINE TO SKIP

timeline.addEventListener("click", (event) => {

  if (!Number.isFinite(audio.duration)) return;

  const rect = timeline.getBoundingClientRect();

  const ratio = Math.max(
    0,
    Math.min(1, (event.clientX - rect.left) / rect.width)
  );

  audio.currentTime = Math.min(
    ratio * MAX_PLAY_SECONDS,
    MAX_PLAY_SECONDS,
    audio.duration
  );

});


// INTERACTIVE PHOTOGRAPHS

const memories = document.querySelectorAll(".memory");

const captionText = document.getElementById("captionText");
const captionPop = document.getElementById("captionPop");

memories.forEach((memory) => {

  memory.addEventListener("click", () => {

    captionText.textContent = memory.dataset.caption;

    captionPop.classList.add("active");

    captionPop.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  });

});


// CLOSE PHOTO CAPTION

document.getElementById("closeCaption")
  .addEventListener("click", () => {

    captionText.textContent =
      "Choose a photograph to uncover its memory.";

    captionPop.classList.remove("active");

  });


// SCROLL ANIMATIONS

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {

      entry.target.style.opacity = "1";

      entry.target.style.transform = "translateY(0)";

      observer.unobserve(entry.target);

    }

  });

}, {
  threshold: 0.15
});


document.querySelectorAll(
  ".intro-grid, .player-card, .gallery-heading, .closing-grid"
).forEach((element) => {

  element.style.opacity = "0";

  element.style.transform = "translateY(25px)";

  element.style.transition =
    "opacity .8s ease, transform .8s ease";

  observer.observe(element);

});


// HERO IMAGE MOVEMENT

const heroImage = document.querySelector(".hero-image");

window.addEventListener("scroll", () => {

  if (window.scrollY < window.innerHeight) {

    heroImage.style.backgroundPositionY =
      `${55 + window.scrollY * 0.025}%`;

  }

}, {
  passive: true
});
