import Analyser from "../lib/analyser";
import load from "@creenv/file-loader";
import PreloadFile from "../lib/source/preload-file";

import AudioManager from "../lib/manager";

import Creenv from "@creenv/core";
import Canvas from "@creenv/canvas";



/**
 * TEST peaks integrity
 */

const framerate = 1/60 * 1000;

let manager = new AudioManager(AudioManager.SOURCE_TYPE.FILE, {
  filepath: "gost-arise.mp3",
  analyser: {
    peakDetection: {
      options: {
        threshold: 1.8
      }
    }
  }
}, true);
let start = 0;
let duration = 0;
let timer = 0;

manager.init().then(() => {
  start = performance.now();
  duration = manager.audioSource.duration;
  update2();
});

function update () {
  let data = manager.getAnalysedAudioData(framerate, timer);
  timer = performance.now() - start;
  addPoint(150 + timer/duration*800, 150 + data.energy);

  console.log(timer, data.energy);

  if (timer < duration) {
    window.requestAnimationFrame(update);
  } else {
    console.log("ended");
  }
}

function update2 () {
  let data = manager.getAnalysedAudioData(framerate, timer);

  /*if (data.peak.value == 1) {
    addBar(150 + timer/duration * 1000, 300);
  }*/

  addPoint(150 + timer/duration*800, 150 + data.energy);
  timer+= framerate;

  console.log(timer, data.energy);

  if (timer < duration) {
    setTimeout(() => {
      update2();
    }, 1);
  } else {
    console.log("ended");
  }
}

let cvs = new Canvas();

function addBar (x, y) {
  cvs.fillStyle("red");
  cvs.rect(x, y-30, 1, 30);
}

function addPoint (x, y) {
  cvs.fillStyle("#00ff00");
  cvs.rect(x, y, 1, 1);
}


/*
class MyProject extends Creenv {
  init () {
    return new Promise((resolve, reject) => {
      this.manager = new AudioManager(AudioManager.SOURCE_TYPE.FILE, {
        filepath: "gost-arise.mp3"
      }, false);
      this.manager.init().then(resolve);
    });
  }

  render () {
    console.log(this.manager.getAnalysedAudioData(this.deltaT, this.elapsedTime));
  }
}

let project = new MyProject();
project.bootstrap();
*/

/*
load("gost-arise.mp3", "arraybuffer").then(data => {
  context.decodeAudioData(data).then(buffer => {
    let offlineContext = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    let source = offlineContext.createBufferSource();
    source.buffer = buffer;

    let scp = offlineContext.createScriptProcessor(512, buffer.numberOfChannels, buffer.numberOfChannels);
    let analyser = offlineContext.createAnalyser();
    analyser.fftSize = 512;

    let freqData = new Uint8Array(analyser.frequencyBinCount);

    source.connect(scp);
    source.connect(analyser);
    scp.connect(offlineContext.destination);

    scp.onaudioprocess = e => {
      analyser.getByteFrequencyData(freqData);
      mem.push(freqData.slice());
      // log(e) -> contains the timer
    }

    offlineContext.oncomplete = e => {
      console.log(mem);
    }

    offlineContext.startRendering();
    source.start();
  });
});
*/