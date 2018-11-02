/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * An audio source from a microphone. Of course user must accepts microphone usage fur such a source to be available.
 **/

import AudioSource from "./audio-source";
import AudioStream from "../stream";
import AudioData from "../audio-data";


class AudioSourceMicrophone extends AudioSource {
  /**
   * creates an audio source from available microphone inputs. will be asking for user's permission.
   * 
   * @param {?number} fftSize MUST BE POW OF 2 - the size of the fourrier transform 
   * @param {?boolean} feedback weither or not microphone should be sent to the speakers
   */
  constructor (fftSize = 512, feedback = false) {
    super(feedback, false);
    this.feedback = feedback;

    this.stream = new AudioStream(this, fftSize);
  }

  /**
   * tries to create a source from available microphone inputs. the promise resolves if stream from microphone is available, 
   * rejects if getUserMedia() is not supported or if permission was denied
   * 
   * @return {Promise}
   */
  load () {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.source = this.audioContext.createMediaStreamSource(stream);
          this.stream.init();
          resolve();
        }).catch(reject);
      }
      else {
        reject("getUserMedia is not supported on this browser");
      }
    });
  }

  /**
   * do not
   */
  play () {
    console.log("couldn't start playing audio: source is a microphone");
  }

  /**
   * @return {AudioData} the timedomain and frequency data of the signal at current timer 
   */
  getAudioData () {
    return this.stream.getAudioData();
  }
};

export default AudioSourceMicrophone;