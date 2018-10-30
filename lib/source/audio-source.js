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
  /**
   * 
   * @param {?boolean} feedback weither or not source should be sent to the speakers
   * @param {?boolean} gain weither or not a gain node can be attaches to this source
   */
  constructor (feedback = true, gain = true) {
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

    /**
     * @type {boolean}
     */
    this.canAttachGainNode = gain;

    /**
     * weither or not source should be sent to the speakers
     * @param {boolean}
     */
    this.feedback = feedback;
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