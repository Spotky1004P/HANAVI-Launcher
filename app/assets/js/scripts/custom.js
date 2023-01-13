const electron = require('electron');

function hrefWorker(el) {
  const link = el.getAttribute("href");
  el.addEventListener("click", () => {
    electron.shell.openExternal(link);
  })
}

/**
 * @param {HTMLElement} el 
 * @param {string} eventType 
 * @param {HTMLAudioElement} sound 
 */
function soundWorker(el, eventType, sound) {
  el.addEventListener(eventType, () => {
    /** @type {HTMLAudioElement} */
    const cloned = sound.cloneNode();
    cloned.volume = 0.4;
    cloned.play();
  });
}
class BackgrounMusic {
  /** @type {HTMLAudioElement} */
  sound;
  volume = 0;
  /** @type {number?} */
  volumeIntervalId = null;

  /**
   * @param {HTMLAudioElement} sound
   */
  constructor(sound) {
    this.sound = sound.cloneNode();
    this.volume = 0;
  }

  play() {
    if (this.volumeIntervalId !== null) return false;

    this.volume = 1;
    this.volumeIntervalId = setInterval(() => {
      this.volume = Math.min(1, this.volume + 0.01);
      this.sound.volume = this.volume;
    }, 20);
    this.sound.play();
    console.log(this.sound)

    return true;
  }

  stop() {
    if (this.volumeIntervalId === null) return false;

    clearInterval(this.volumeIntervalId);
    this.sound.pause();

    return true;
  }
}


const els = {
  news: {
    "news1": document.getElementById("news1"),
    "news2": document.getElementById("news2")
  },
  landing: {
    "start": document.getElementById("launch_button"),
    "preLaunch": document.getElementById("pre_launch"),
    "postLaunch": document.getElementById("post_launch"),
    "website": document.getElementById("nav_website"),
    "discord": document.getElementById("nav_discord"),
    "setting": document.getElementById("settingsMediaButton")
  },
  setting: {
    "navs": [...document.getElementsByClassName("settingsNavItem")],
    "done": document.getElementById("settingsNavDone")
  }
};

const sounds = {
  "click": document.getElementById("audio__ui-click"),
  "hover": document.getElementById("audio__ui-hover"),
  "bg": document.getElementById("audio__ui-bg"),
};

hrefWorker(els.landing.website);
hrefWorker(els.landing.discord);

const elToAddSound = [
  els.news.news1, els.news.news2,
  els.landing.start,
  els.landing.website, els.landing.discord, els.landing.setting,
  ...els.setting.navs, els.setting.done
];
for (const el of elToAddSound) {
  soundWorker(el, "mouseenter", sounds.hover);
  soundWorker(el, "click", sounds.click);
}
const bg = new BackgrounMusic(sounds.bg);
bg.play();

els.landing.start.addEventListener("click", () => {
  els.landing.preLaunch.style.display = "none";
  els.landing.postLaunch.style.display = "";
  document.getElementById("launch_details").style.display = "";
});
