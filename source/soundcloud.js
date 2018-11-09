/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * A source from a soundcloud url. 
 **/ 

import AudioSource from "./audio-source";
import SoundcloudAudio from "soundcloud-audio";
import AudioStream from "../stream";
import AudioData from "../audio-data";


class AudioSourceSoundcloud extends AudioSource {
  /**
   * creates a source from a soundcloud url. you must provide a ClientID, required by soundcloud APIs
   * 
   * @param {string} clientID your soundcloud client ID. can be found using google
   * @param {string} url the soundcloud url to load. can either be a track url, playlist url
   * @param {?number} fftSize MUST BE A POW OF 2 - size of the fourrier transform performed on the signal 
   * @param {?boolean} feedback weither or not source should be sent to the speakers
   */
  constructor (clientID, url, fftSize = 512, feedback = true) {
    super(feedback);

    /**
     * @type {string}
     */
    this.clientID = clientID;

    /**
     * @type {string}
     */
    this.url = url;

    /**
     * created bu soundcloud-audio to handle audio play 
     * @type {*}
     */
    this.scPlayer = null;

    /**
     * @type {AudioStream}
     */
    this.stream = new AudioStream(this, fftSize);
  }

  /**
   * starts loading the source url. the promise resolves if an available source has been found, rejects if none is 
   * available at the url, or if url couldn't be fetched
   * the loader uses soundcloud-audio to perform such a task 
   * <https://github.com/voronianski/soundcloud-audio.js>
   * 
   * @return {Promise}
   */
  load () {
    return new Promise((resolve, reject) => {
      this.scPlayer = new SoundcloudAudio(this.clientID);
      this.scPlayer.resolve(url, playlist => {
        this.scPlayer.audio.crossOrigin = "anonymous";
        this.source = this.audioContext.createMediaElementSource(this.scPlayer.audio);
        this.stream.init();
        resolve();
      });
    });
  }

  /**
   * starts playing the audio 
   */
  play () {
    this.scPlayer.play();
  }

  /**
   * @return {AudioData} the timedomain and frequency data at the current timer 
   */
  getAudioData () {
    return this.stream.getAudioData();
  }
};

export default AudioSourceSoundcloud;