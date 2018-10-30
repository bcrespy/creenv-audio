/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * A file acting as audio source. The file is first loaded, stored in a buffer, making him available for lecture
 **/

import AudioSource from './audio-source';


class AudioSourceFile extends AudioSource {
  /**
   * creates an audio source from a file previously loaded within the browser (such a thing can be implemented via the input 
   * file, drag and drop, or by using creenv gui tool)
   * 
   * @param {File} file path to a media element
   */
  constructor (file) {
    super();

    /**
     * @type {string}
     */
    this.file = file;
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
          resolve();
        });
      });
      reader.readAsArrayBuffer(this.file);
    });
  }
};

export default AudioSourceFile;