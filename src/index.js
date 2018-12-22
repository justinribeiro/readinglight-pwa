'use strict';

/** @const */
const appOpts = {
  dom: {
    root: document.documentElement,
    lux: document.querySelector('#lux'),
    color: document.querySelector('#color'),
  },
  wakeLock: null,
  color: null,
};

lux.addEventListener('input', (event) => {
  appOpts.dom.root.style.setProperty('--lightness', `${event.target.value}%`);
});

color.addEventListener('input', (event) => {
  changeBackgroundColor(event.target.value);
});

color.addEventListener('change', (event) => {
  appOpts.color = event.target.value;
  requestIdleCallback(storeBackgroundColor, {
    timeout: 5000
  });
});

const storeBackgroundColor = () => {
  localStorage.setItem('color', appOpts.color);
}

const changeBackgroundColor = (color) => {
  const [h, s, l] = rgbhexToHsl(color);
  appOpts.dom.root.style.setProperty('--hue', h);
  appOpts.dom.root.style.setProperty('--saturation', `${s}%`);
  appOpts.dom.root.style.setProperty('--lightness', `${l}%`);
  lux.value = l;
}

// I was originally going to just use the algo from
// https://en.wikipedia.org/wiki/HSL_and_HSV but turns out friend of the show
// @mjackson did it already in https://gist.github.com/mjackson/5311256, so I
// just bolted a hex converter and some simple multipliers :-)
const rgbhexToHsl = (color) => {
  let [hex, r, g, b] = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(color);
  r = parseInt(r, 16) / 255;
  g = parseInt(g, 16) / 255;
  b = parseInt(b, 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = Math.round(((max + min)) / 2 * 100);

  let h, s;

  if (max === min) {
      h = s = 0;
  } else {
    const d = max - min;
    s = Math.round((l > 0.5 ? d / (2 - max - min) : d / (max + min)) * 100);
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round((h / 6) * 360);
  }
  return [h, s, l];
}

const startWakeLock = () => {
  try {
    navigator.getWakeLock('screen').then((wakeLock) => {
      appOpts.wakeLock = wakeLock.createRequest();
    });
  } catch(error) {
    // no experimental wake lock api build
  }
}

const startServiceWorker = () => {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  });
}

const init = () => {
  const color = localStorage.getItem('color')
  if (color) {
    changeBackgroundColor(color);
    appOpts.dom.color.value = color;
  } else {
    changeBackgroundColor('#ff69b4');
  }
  startWakeLock();
  startServiceWorker();
};

init();