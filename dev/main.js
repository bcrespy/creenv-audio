import AudioSource from "../lib/source/microphone";
import AudioStream from "../lib/stream";
import Analyser from "../lib/analyser";
import load from "@creenv/file-loader";
import PreloadFile from "../lib/source/preload-file";

import AudioManager from "../lib/manager";


let manager = new AudioManager(AudioManager.SOURCE_TYPE.FILE, {
  filepath: "gost-arise.mp3"
}, false);
manager.init().then(update);

let deltaT = 0, elapsed = 0, lastFrame;


function update () {
  setTimeout(() => {
    update();
  }, 1000);
  elapsed+= performance.now()/ 10000;
  console.log(manager.analysis(elapsed));
}

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