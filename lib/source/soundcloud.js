/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * A source from a soundcloud url. 
 **/ 

import AudioSource from "./audio-source":
import SoundcloudAudio from "soundcloud-audio";


class AudioSourceSoundcloud extends AudioSource {
  /**
   * creates a source from a soundcloud url. you must provide a ClientID, required by soundcloud APIs
   * 
   * @param {string} clientID your soundcloud client ID. can be found using google
   * @param {string} url the soundcloud url to load. can either be a track url, playlist url
   * @param {?boolean} feedback weither or not source should be sent to the speakers
   */
  constructor (clientID, url, feedback) {
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
};

export default AudioSourceSoundcloud;