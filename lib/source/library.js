/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * For loading audio files inherent to the application. Files must be served.
 **/

import AudioSource from './audio-source';


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
   * first loads the file using XMLHttpRequest, then use the buffer to create a playable audio source
   */
  load () {

  }
};

export default AudioSourceLibrary;