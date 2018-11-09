/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * An history, stored with time values of an audio data array 
 */

import AudioData from "./audio-data";

class AudioDataHistory {
  
  /**
   * The AudioDataHistory stores audio data, indexing it by their timing. The data can then be accessed using a time value.
   */
  constructor () {
    /**
     * @type {Array.<AudioData>}
     */
    this.datas = new Array();
    
    /**
     * @type {Array.<number>}
     */
    this.timers = new Array();
  }

  /**
   * Parse the recorded timers and as soon as a timer is greater than @param timer, returns the entry preceding
   * 
   * @param {number} timer timer of the data you want to access, is compared to previously stored timer values
   * 
   * @return {AudioData}
   */
  getDataAt (timer) {
    let idx = -1;
    for (let i in this.timers) {
      if (timer < this.timers[i]) {
        idx = i-1;
        break;
      }
    }
    return idx ? this.datas[idx] : false;
  }

  /**
   * Saves the data as a shallow copy at a given timer
   * 
   * @param {AudioData} data audio processed data to be recorded
   * @param {number} timer data entry will be saved next to this number, used later for comparisons in the getDataAt
   */
  saveDataAt (data, timer) {
    this.datas.push(data);
    this.timers.push(timer);
  }
};

export default AudioDataHistory;