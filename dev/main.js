import AudioSource from "../source/microphone";
import AudioStream from "../stream";
import Analyser from "../analyser";
import load from "@creenv/file-loader";


//let offlineContext = new OfflineAudioContext();

let context = new AudioContext();

let mem = new Array();

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