/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * An audio stream reads data from an audio source as it is playing. 
 **/


import AudioData from "./audio-data";
import AudioSource from "./source/audio-source";


class AudioStream {
  /**
   * creates an audio stream from an audio source. such a stream is required to be able to read the data from the source as
   * it is playing
   * 
   * @param {AudioSource} audiosource Audio source from which the data is gathered
   * @param {number} fftSize Size of the fourier transform. Must be pow of 2
   * @param {number} volume [0.0; 1.0] Volume used by default 
   */
  constructor (audiosource, fftsize = 512, volume = 1.0) {
    /**
     * @type {AudioSource}
     */
    this.audioSource = audiosource;

    /**
     * @type {AudioContext}
     */
    this.audioContext = audiosource.audioContext;

    /**
     * @type {string}
     */
    this.volume = volume;

    /**
     * @type {number}
     */
    this.fftsize = fftsize;

    /**
     * @type {AudioBufferSourceNode}
     */
    this.sourceNode = null;

    /**
     * @type {GainNode}
     */
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

    /**
     * @type {AnalyserNode}
     */
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = fftsize;
    //this.analyserNode.smoothingConstant = 0.9;

    this.bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }


  /**
   * this method needs to be called once the audio source is properly loaded. if a gain node can be connected to the source,
   * first connects the source to the gain node, and then connects the node to an analyser node, which is then connected to
   * the destination, if audiosource feedback is set to true 
   */
  init() {
    this.sourceNode = this.audioSource.source;
    if (!this.sourceNode) {
      console.error(`audio stream initialization failed. source is empty`);
    } else {
      if (this.audioSource.canAttachGainNode) {
        this.sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        if (this.audioSource.feedback) {
          this.gainNode.connect(this.audioContext.destination);
        }
      } else { // gain node can't be attached (ex: microphone)
        this.sourceNode.connect( this.analyserNode );
        if (this.audioSource.feedback) {
          this.analyserNode.connect( this.audioContext.destination );
        }
      }
    }
  }


  /**
   * @returns {AudioData} Audio data containing time domain data and frequency data
   */
  getAudioData () {
    let tdData = new Uint8Array(this.bufferLength),
        fData = new Uint8Array(this.bufferLength);
    this.analyserNode.getByteTimeDomainData(tdData);
    this.analyserNode.getByteFrequencyData(fData);
    
    return new AudioData(tdData, fData, this.bufferLength);
  }


  /**
   * Changes the volume
   * @param {number} volume [0.0; 1.0] New Volume
   */
  setVolume (volume) {
    this.volume = volume;
    this.gainNode.gain.setValueAtTime( volume, this.audioContext.currentTime );
  }


  /**
   * @returns The current volume
   */
  getVolume () {
    return this.volume;
  }


  /**
   * @return Size of the data buffer
   */
  getBufferSize () {
    return this.bufferLength;
  }
};

export default AudioStream;