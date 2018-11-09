/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * This audio source is an "offline source". After loading the file, it is being processed entirely. This process is useful
 * for rendering in decay, when it is not possible to render in real time (when capturing for instance).
 */

import loadFile from "@creenv/file-loader";
import AudioSource from "./audio-source";
import AudioData from "../audio-data";
import AudioDataHistory from "../audio-data-history";


class OfflineFileSource extends AudioSource {
  /**
   * loads a file and then processes the audio from file before the application starts. this process is required when trying to
   * capture because rendering can't be done in real time.
   * 
   * @param {string} filepath path to the file
   * @param {?number} bufferSize MUST BE POW OF 2 - size of the buffer used to capture and process audio
   */
  constructor (filepath, bufferSize = 512) {
    super();

    /**
     * @type {string}
     */
    this.filepath = filepath;

    /**
     * @type {number}
     */
    this.bufferSize = bufferSize;

    this.bufferLength = 0;

    /**
     * @type {OfflineAudioContext}
     */
    this.offlineContext = null;

    /**
     * duration of the input audio, in ms
     * @type {number}
     */
    this.duration = 0;

    /**
     * The history of the recorded audio data 
     * @type {AudioDataHistory}
     */
    this.dataHistory = new AudioDataHistory();
  }

  /**
   * loads the file, then processes its audio an analyse it, storing the analysed data into an array.
   */
  load() {
    return new Promise((resolve, reject) => {
      loadFile(this.filepath, "arraybuffer").then(data => {
        console.log("audio file is being processed");
        // file is turned into an audio buffer
        this.audioContext.decodeAudioData(data).then(buffer => {
          this.duration = buffer.duration*1000; // conversion in ms

          // an offline context matching the buffer is created 
          let offlineContext = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
          let source = offlineContext.createBufferSource();
          source.buffer = buffer;
          
          // a processor and analyser nodes to extract frequency data and timedomain data 
          let scp = offlineContext.createScriptProcessor(this.bufferSize, buffer.numberOfChannels, buffer.numberOfChannels);
          let analyser = offlineContext.createAnalyser();
          analyser.fftSize = this.bufferSize;
          this.bufferLength = analyser.frequencyBinCount;

          let gainNode = offlineContext.createGain();
          gainNode.gain.setValueAtTime(1.0, 0);
      
          source.connect(gainNode);
          gainNode.connect(scp);
          gainNode.connect(analyser);
          scp.connect(offlineContext.destination);
      
          // each time a sample is processed this method gets called 
          scp.onaudioprocess = e => {
            let freqData = new Uint8Array(analyser.frequencyBinCount);
            let timedomainData = new Uint8Array(analyser.frequencyBinCount);

            analyser.getByteFrequencyData(freqData);
            analyser.getByteTimeDomainData(timedomainData);
            
            // data is sent to the history 
            let data = new AudioData(freqData, timedomainData, this.bufferLength);
            this.dataHistory.saveDataAt(data, e.playbackTime*1000);
          }
      
          offlineContext.oncomplete = e => {
            console.log("audio was processed");
            resolve();
          }
      
          offlineContext.startRendering();
          source.start();
        });
      });
    });
  }

  /**
   * 
   */
  getAudioData (timer) {
    let data = this.dataHistory.getDataAt(timer);
    return (!data) ?
      new AudioData(new Uint8Array(this.bufferSize), new Uint8Array(this.bufferSize), this.bufferSize) :
      data;
  }
};

export default OfflineFileSource;