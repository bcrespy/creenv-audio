import AudioSource from "../lib/source/microphone";
import AudioStream from "../lib/stream";


let source = new AudioSource(true)
let stream = new AudioStream(source);

source.load().then(() => {
  stream.init();
  analysis();
}).catch(console.error);

function analysis() {
  window.requestAnimationFrame(analysis);
  console.log(stream.getAudioData());
}