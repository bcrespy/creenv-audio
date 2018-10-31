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

    this.options = options;

    this.capture = capture;

    // find a better way to do that, maybe with the AudioSource factory creating the audio source ? pass it options parameter
    this.audioSource = new (AudioSourceFactory(sourceType, capture))(...options);
  }

  analysis () {

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
 */
function AudioSourceFactory (type, capture = false) {
  let TYPE = AudioManager.SOURCE_TYPE;
  switch (type) {
    case TYPE.FILE: 
      return capture ? AudioSourceOfflineFile : AudioSourceLibrary;

    case TYPE.UPLOADED_FILE: 
      return AudioSourceFile;
    
    case TYPE.MICROPHONE: 
      return AudioSourceMicrophone;
    
    case TYPE.SOUNDCLOUD:
      return AudioSourceSoundcloud;
    
    default: 
      return AudioSourceLibrary;
  }
}

export default AudioManager;