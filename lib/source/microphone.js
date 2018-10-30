/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * An audio source from a microphone. Of course user must accepts microphone usage fur such a source to be available.
 **/

import AudioSource from "./audio-source";


class AudioSourceMicrophone extends AudioSource {
  /**
   * creates an audio source from available microphone inputs. will be asking for user's permission.
   * 
   * @param {?boolean} feedback weither or not microphone should be sent to the speakers
   */
  constructor (feedback = false) {
    super(feedback, false);
    this.feedback = feedback;
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
};

export default AudioSourceMicrophone;