/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * For loading audio files inherent to the application. Files must be served.
 **/

import AudioSource from "./audio-source";
import FileLoader from "@creenv/file-loader";


class AudioSourceLibrary extends AudioSource {
  /**
   * creates an audio source from a file that will later be loaded when the load() method will be called.
   * 
   * @param {string} path path to the audio element to be loaded
   */
  constructor (path) {
    super();
    this.path = path;
  }

  /**
   * first loads the file using XMLHttpRequest, then use the buffer to create a playable audio source. resolves if the loading
   * and source initialization is successful, rejects if not the case
   * 
   * @return {Promise}
   */
  load () {
    return new Promise((resolve, reject) => {
      FileLoader(this.path, "arraybuffer").then(audioData => {
        this.audioContext.decodeAudioData(audioData).then(buffer => {
          this.source = this.audioContext.createBufferSource();
          this.source.buffer = buffer;
          resolve();
        }).catch(reject);
      }).catch(reject);
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
};

export default AudioSourceLibrary;