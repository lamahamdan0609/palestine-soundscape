
// FIND THE AUDIO PLAYER ELEMENTS

const audio = document.getElementById("soundtrack");

const playButton = document.getElementById("playButton");
const navSound = document.getElementById("navSound");

const wave = document.getElementById("wave");
const progress = document.getElementById("progress");
const timeline = document.getElementById("timeline");

const currentTimeLabel = document.getElementById("currentTime");
const playerHint = document.getElementById("playerHint");
const volume = document.getElementById("volume");


// SOUND WILL PLAY FOR 75 SECONDS

const MAX_PLAY_SECONDS = 75;


// FORMAT THE AUDIO TIMER

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}


// UPDATE THE PLAY BUTTON AND SOUND WAVE

function setPlaying(isPlaying) {

  playButton.textContent = isPlaying ? "Ⅱ" : "▶";

  navSound.querySelector("span").textContent =
    isPlaying ? "Sound on" : "Sound off";

  wave.classList.toggle("playing", isPlaying);

}


// PLAY AND PAUSE AUDIO

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

      playerHint.textContent =
        "Please add the recording to the audio folder first.";

    }

  } else {

    audio.pause();

    setPlaying(false);

  }

}


// BUTTON INTERACTIONS

playButton.addEventListener("click", toggleAudio);

navSound.addEventListener("click", toggleAudio);


// VOLUME CONTROL

audio.volume = Number(volume.value);

volume.addEventListener("input", () => {

  audio.volume = Number(volume.value);

});


// UPDATE THE AUDIO PROGRESS BAR

audio.addEventListener("timeupdate", () => {

  const current = Math.min(
    audio.currentTime,
    MAX_PLAY_SECONDS
  );

  progress.style.width =
    `${(current / MAX_PLAY_SECONDS) * 100}%`;

  currentTimeLabel.textContent = formatTime(current);


  // STOP AUDIO AFTER 75 SECONDS

  if (audio.currentTime >= MAX_PLAY_SECONDS) {

    audio.pause();

    audio.currentTime = MAX_PLAY_SECONDS;

    setPlaying(false);

    playerHint.textContent =
      "A little moment from Palestine. Press play to listen again.";

  }

});


// RESET PLAY BUTTON WHEN AUDIO ENDS

audio.addEventListener("ended", () => {

  setPlaying(false);

});

audio.addEventListener("pause", () => {

  setPlaying(false);

});


// CLICK THE PROGRESS BAR TO SKIP THROUGH AUDIO

timeline.addEventListener("click", (event) => {

  const rect = timeline.getBoundingClientRect();

  const ratio = Math.max(
    0,
    Math.min(1, (event.clientX - rect.left) / rect.width)
  );

  if (audio.duration) {

    audio.currentTime = Math.min(
      ratio * MAX_PLAY_SECONDS,
      MAX_PLAY_SECONDS
    );

  }

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


// CLOSE THE PHOTO CAPTION

document.getElementById("closeCaption")
  .addEventListener("click", () => {

    captionText.textContent =
      "Choose a photograph to uncover its memory.";

    captionPop.classList.remove("active");

  });


// SCROLL ANIMATION

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


// REVEAL SECTIONS AS THEY ENTER THE SCREEN

document.querySelectorAll(
  ".intro-grid, .player-card, .gallery-heading, .closing-grid"
).forEach((element) => {

  element.style.opacity = "0";

  element.style.transform = "translateY(25px)";

  element.style.transition =
    "opacity .8s ease, transform .8s ease";

  observer.observe(element);

});


// GENTLE HERO IMAGE MOVEMENT WHEN SCROLLING

const heroImage = document.querySelector(".hero-image");

window.addEventListener("scroll", () => {

  if (window.scrollY < window.innerHeight) {

    heroImage.style.backgroundPositionY =
      `${55 + window.scrollY * 0.025}%`;

  }

}, {
  passive: true
});
