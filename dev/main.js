import AudioSource from "../lib/source/microphone";
import AudioStream from "../lib/stream";
import Analyser from "../lib/analyser";


let source = new AudioSource(true)
let stream = new AudioStream(source);
let analyser = new Analyser({
  fftSize: 500,
  peakDetection: {
    options: {
      ignoreTime: 50
    }
  }
});

source.load().then(() => {
  stream.init();
  analysis();
}).catch(console.error);

function analysis() {
  window.requestAnimationFrame(analysis);
  
}