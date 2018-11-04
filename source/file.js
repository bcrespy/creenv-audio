/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * A file acting as audio source. The file is first loaded, stored in a buffer, making him available for lecture
 **/

import AudioSource from "./audio-source";
import AudioStream from "../stream";


class AudioSourceFile extends AudioSource {
  /**
   * creates an audio source from a file previously loaded within the browser (such a thing can be implemented via the input 
   * file, drag and drop, or by using creenv gui tool)
   * 
   * @param {File} file path to a media element
   * @param {?number} fftSize MUST BE A POW OF 2, size of the fourrier transform
   * @param {?boolean} feedback weither or not source should be sent to the speakers
   */
  constructor (file, fftSize = 512, feedback = true) {
    super(feedback);

    /**
     * @type {string}
     */
    this.file = file;

    /**
     * @type {AudioStream}
     */
    this.stream = new AudioStream(this, fftSize);
  }

  /**
   * starts loading the file at filepath. the promise resolves once the file has been read and stored in a buffer within the
   * audio context 
   * 
   * @return {Promise}
   */
  load () {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener('load', (e) => {
        let data = e.target.result;
        this.audioContext.decodeAudioData(data).then(buffer => {
          this.source = this.audioContext.createBufferSource();
          this.source.buffer = buffer;
          this.stream.init();
          resolve();
        });
      });
      reader.readAsArrayBuffer(this.file);
    });
  }

  /**
   * plays the audio after @param when seconds
   * 
   * @param {?number} when offset in seconds in which audio is supposed to start, after method had been called
   * @param {?number} offset offset in seconds from the start of the audio source where lecture has to start
   */
  play (when = 0, offset = 0) {
    this.source.start(when, offset);
  }

  /**
   * @return {AudioData} the timedomain and frequency data of the signal at current timer
   */
  getAudioData () {
    return this.stream.getAudioData();
  }
};

export default AudioSourceFile;