import Analyser from "../lib/analyser";
import load from "@creenv/file-loader";
import PreloadFile from "../lib/source/preload-file";

import AudioManager from "../lib/manager";

import Creenv from "@creenv/core";


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