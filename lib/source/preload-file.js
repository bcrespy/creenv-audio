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

import toWav from "audiobuffer-to-wav";


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
     * the size in bytes of the saved buffer 
     */
    this.audioBufferSize = 0;
    this.audioBuffer = null;

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

          // we save the buffer 
          this.audioBuffer = buffer;
          this.audioBufferSize = buffer.length*buffer.sampleRate;

          // an offline context matching the buffer is created 
          let offlineContext = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
          let source = offlineContext.createBufferSource();
          source.buffer = buffer;
          
          // a processor and analyser nodes to extract frequency data and timedomain data 
          let scp = offlineContext.createScriptProcessor(this.bufferSize, buffer.numberOfChannels, buffer.numberOfChannels);
          let analyser = offlineContext.createAnalyser();
          analyser.fftSize = this.bufferSize;
          this.bufferLength = analyser.frequencyBinCount;

          source.connect(scp);
          source.connect(analyser);
          scp.connect(offlineContext.destination);
      
          // each time a sample is processed this method gets called 
          scp.onaudioprocess = e => {
            let freqData = new Uint8Array(analyser.frequencyBinCount);
            let timedomainData = new Uint8Array(analyser.frequencyBinCount);

            analyser.getByteFrequencyData(freqData);
            analyser.getByteTimeDomainData(timedomainData);
            
            // data is sent to the history 
            let data = new AudioData(timedomainData, freqData, this.bufferLength);
            this.dataHistory.saveDataAt(data, e.playbackTime*1000);
          }

          offlineContext.oncomplete = () => {
            console.log("audio file processed");
            resolve();
          };

          /*let timerAnalysis = 0,
              sampleRate = 1.0/60.0; // in seconds

          offlineContext.suspend(sampleRate).then(() => {
            let freqData = new Uint8Array(analyser.frequencyBinCount);
            let timedomainData = new Uint8Array(analyser.frequencyBinCount);

            analyser.getByteFrequencyData(freqData);
            analyser.getByteTimeDomainData(timedomainData);

            let data = new AudioData(freqData, timedomainData, this.bufferLength);
            this.dataHistory.saveDataAt(data, timerAnalysis*1000);
          });*/
      
          offlineContext.startRendering();
          source.start();

          /*this.contextAnalysis(offlineContext, 0, analyser).then(() => {
            resolve();
          });*/
        });
      });
    });
  }

  /**
   * returns the blob corresponding to the wav encoded audio data of the loaded file 
   * 
   * @param {number} start must be in MS
   * @param {number} duration must be in MS
   * 
   * @return {Blob}
   */
  copyAudioData (start, duration) {
    // from milliseconds to seconds 
    start/= 1000;
    duration/= 1000;

    if (start+duration > this.audioBuffer.duration) {
      console.error("start and duration specified are exceeding the buffer size");
    }

    // we compute the index of start and end in the buffer 
    let startIndex = Math.floor(this.audioBuffer.sampleRate * start),
        endIndex = Math.floor(startIndex + this.audioBuffer.sampleRate * duration);

    let copyBuffer = new AudioBuffer({
      length: endIndex-startIndex, 
      numberOfChannels: this.audioBuffer.numberOfChannels,
      sampleRate: this.audioBuffer.sampleRate
    });

    // we parse the channels and copy the data from 
    for (let i = 0; i < this.audioBuffer.numberOfChannels; i++) {
      let channel = this.audioBuffer.getChannelData(i).slice(startIndex, endIndex);
      copyBuffer.copyToChannel(channel, i);
    }

    return new Blob([ new DataView(toWav(copyBuffer)) ], {
      type: "audio/wav"
    });
  }

  /**
   * this method can also be used as a tool analysis, but it is a bit slower than the other algorithm
   */
  contextAnalysis (offlineContext, timerAnalysis, analyser) {
    return new Promise((resolve, reject) => {

      const rec = (offlineContext, timerAnalysis, analyser) => {
        let sampleRate = 1/60;
        offlineContext.suspend(timerAnalysis).then(() => {
          let freqData = new Uint8Array(analyser.frequencyBinCount);
          let timedomainData = new Uint8Array(analyser.frequencyBinCount);
    
          analyser.getByteFrequencyData(freqData);
          analyser.getByteTimeDomainData(timedomainData);

          let data = new AudioData(timedomainData, freqData, this.bufferLength);
          this.dataHistory.saveDataAt(data, timerAnalysis*1000);
    
          timerAnalysis+= sampleRate;
          rec(offlineContext, timerAnalysis, analyser);
        });
    
        if (timerAnalysis == 0) 
          offlineContext.startRendering();
        else {
          if (((timerAnalysis+sampleRate)*1000)/this.duration >= 1 ) {
            resolve();
          } else {
            offlineContext.resume();
          }
        }
      } 

      rec(offlineContext, 0, analyser);
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