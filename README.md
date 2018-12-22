# readinglight-pwa
A tiny no-frills screen reading light progressive web app based on WakeLock API.

## Why?

I read books at night to my kids. I don't want the 5MB app with ads to be able to light a book I'm trying to read.

## How does it work

Pretty basic: the `<input type="color">` for the color picker, `<input type="range">` for the lightness of said color, some [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) that allow us to quickly use the color and lightness to set the HSL values on the background and call to [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) to store said value in localStorage (just because).

## The special sauce: Screen lock

The problem with apps like this in the past is the screen would eventually go off. Since M71, the [WakeLock API](https://www.w3.org/TR/wake-lock/) has been enabled for testing purposes (see the current status on [Chrome Platform Status](https://www.chromestatus.com/feature/4636879949398016)). This ideally allows us to keep the screen from going into power saving mode and generally an off state. I've enabled this (you'll need M71 Chrome for Android) for testing.

## Dev

Hop into the `src` folder and run the local web server of your choice. No specific tool required.

## Build

I didn't really wrap this with build tooling, but I did crunch it down to 1.7K gzip'ed for fun using closure compiler and http-minifier. The rest is just some fancy Linux CLI jumping and sed (and I almost just used a make file instead ;-).

```
$ yarn install
$ yarn dist
```

### FAQ

> 1. How accurate is this?

When the dash is working on the Prius, it's pretty accurate from the looks of it. You're going to be constainted on any number of know problems with GPS (e.g., when the `Coordinates.accuracy` is not very good because of lock or assist issues).

> 2. Why didn't you use build tools/a framework/something I like.

Didn't feel the need.