/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * 
 **/

/**
 * @abstract
 */
class AudioSource {
  constructor () {
    /**
     * the context 
     * @type {AudioContext}
     */
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    /**
     * the source node, generic way of representing an audio source 
     * @type {AudioBufferSourceNode}
     */
    this.source = false;
  }

  /**
   * this method ust be implemented by the children 
   * 
   * @param {?any} source the details about the source to be loaded
   * 
   * @return {Promise} a promise which resolves when the source loading is complete
   * @abstract
   */
  load (source = null) {
  }

  /**
   * must be implemented by the children 
   * defines a way to start playing audio to the context 
   * 
   * @abstract
   */
  play () {
  }
};

export default AudioSource;