/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * The manager links the components together. It is possible to use the library without using the manager, but the manager 
 * makes the process easier for analysis 
 */

import AudioSource from "./source/audio-source";
import AudioSourceFile from "./source/file";
import AudioSourceOfflineFile from "./source/preload-file";
import AudioSourceLibrary from "./source/library";
import AudioSourceMicrophone from "./source/microphone";
import AudioSourceSoundcloud from "./source/soundcloud";
import AudioAnalysedData from "./audio-analysed-data";
import AudioAnalyser from "./analyser";
import AudioData from "./audio-analysed-data";
import deepmerge from "deepmerge";


const DEFAULT_OPTIONS = {
  volume: 1.0,
  bufferSize: 512,
  feedback: true,
  analyserOptions: {}
};



class AudioManager {
  /**
   * The manager simplifies the usage of @creenv/audio library. It abstract more complexe concepts. 
   * 
   * @param {number} sourceType AudioManager.SOURCE_TYPE 
   * @param {object} options an object of options, see the doc for more informations on what option needs to be supplied 
   *                         depending on the source type 
   * @param {?boolean} capture weither capture mode is enabled or not. if it is enabled, source type can only be FILE, and 
   *                           later, when it will be implemented, UPLOADED_FILE
   */
  constructor (sourceType, options, capture = false) {
    if (capture && sourceType != AudioManager.SOURCE_TYPE.FILE) {
      console.warn("audio won't work properly in capture mode if source is not of a file");
    }

    this.sourceType = sourceType;

    this.options = deepmerge(DEFAULT_OPTIONS, options);

    this.capture = capture;

    this.analyser = new AudioAnalyser(this.options.bufferSize, this.options.analyser);

    // find a better way to do that, maybe with the AudioSource factory creating the audio source ? pass it options parameter
    this.audioSource = AudioSourceFactory(sourceType, this.options, capture);
  }

  /**
   * Intialize the audio components. If files need to be downloaded, url fetched, microphone set up, this will takes place
   * during the execution of this method 
   * 
   * @return {Promise} resolves when the audio source is properly loaded 
   */
  init () {
    return new Promise((resolve, reject) => {
      this.audioSource.load().then(() => {
        if (!this.capture) {
          this.audioSource.play();
        }
        resolve();
      }).catch(reject);
    });
  }

  /**
   * if capture mode is enabled, a timer, absolute to the audio duration must be sent as argument, otherwise the timer won't be
   * used. returns the timedomaine and frequency data of the signal 
   * 
   * @param {?number} timer ONLY IF CAPTURE IS ENABLED, the offset to the audio's beginning
   * 
   * @return {AudioData}
   */
  getAudioData (timer = 0) {
    return this.audioSource.getAudioData(timer);
  }

  /**
   * if capture mode is enabled, a timer, absolute to the audio duration must be sent as argument, otherwise the timer won't be
   * used. returns analysed data 
   * 
   * @param {number} deltaTime time since last asked analysis
   * @param {number} timer the timer of the asked analysis 
   * 
   * @return {AudioAnalysedData} data processed by the analyser
   */
  getAnalysedAudioData (deltaTime, timer = 0) {
    let audioData = this.getAudioData(timer);
    return this.analyser.analyse(audioData, deltaTime, timer);
  }

  /**
   * if starting the audio is required by your implementation 
   * 
   * @param {any...}
   */
  play (...args) {
    this.audioSource.play(...args);
  }

  /**
   * if stopping the audio is required by your implementation 
   */
  stop () {
    this.audioSource.source.stop();
  }
};

/**
 * @enum 
 */
AudioManager.SOURCE_TYPE = {
  FILE: 0,
  UPLOADED_FILE: 1,
  MICROPHONE: 2,
  SOUNDCLOUD: 3
};

/**
 * creates an audio source given the options 
 * 
 * @param {number} type the SOURCE_TYPE of the input audio 
 * @param {object} options the options sent to the Audio Source object 
 * @param {?boolean} capture weither the capture mode is enable or not, will determine how an input should behave 
 * 
 * @return {AudioSource} an instanciated audio source 
 */
function AudioSourceFactory (type, options, capture = false) {
  let TYPE = AudioManager.SOURCE_TYPE;
  switch (type) {
    case TYPE.FILE: 
      return capture ? 
        new AudioSourceOfflineFile(options.filepath, options.fftSize) : 
        new AudioSourceLibrary(options.filepath, options.fftSize, options.feedback);

    case TYPE.UPLOADED_FILE: 
      return new AudioSourceFile(options.file, options.fftSize, options.feedback);
    
    case TYPE.MICROPHONE: 
      return new AudioSourceMicrophone(options.fftSize, options.feedback);
    
    case TYPE.SOUNDCLOUD:
      return new AudioSourceSoundcloud(options.clientID, options.url, options.fftSize, options.feedback);
    
    default: 
      return new AudioSourceLibrary(options.filepath, options.fftSize, options.feedback);
  }
}

export default AudioManager;