import Analyser from "../lib/analyser";
import load from "@creenv/file-loader";
import PreloadFile from "../lib/source/preload-file";

import AudioManager from "../lib/manager";

import Creenv from "@creenv/core";
import Canvas from "@creenv/canvas";



/**
 * TEST peaks integrity
 */


const CAPTURE = true;

const framerate = 1/60 * 1000;

let manager = new AudioManager(AudioManager.SOURCE_TYPE.FILE, {
  filepath: "test.wav",
  analyser: {
    peakDetection: {
      options: {
        threshold: 1.8
      }
    }
  }
}, CAPTURE);
let start = 0;
let duration = 0;
let timer = 0;

let cvs = new Canvas();

manager.init().then(() => {
  // (manager.getAudioCopy(1.5, 1.0))
  start = performance.now();
  duration = manager.audioSource.duration;
  cvs.fillStyle("red");
  cvs.rect(0,200,700,1);
  if (CAPTURE) update()
  else update2();
});

function update () {
  let data = manager.getAnalysedAudioData(framerate, timer);
  timer = performance.now() - start;
  addPoint(50+timer/duration*400, 200-data.energy);

  console.log(data.energy);

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

  addPoint(50+timer/duration*400, 200-data.energy);
  timer+= framerate;

  console.log(data.energy);

  if (timer < duration) {
    setTimeout(() => {
      update2();
    }, 1);
  } else {
    console.log("ended");
  }
}


function addBar (x, y) {
  cvs.fillStyle("red");
  cvs.rect(x, y-30, 1, 30);
}

function addPoint (x, y) {
  cvs.fillStyle("#00ff00");
  cvs.rect(x, y, 2, 1);
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