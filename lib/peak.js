

export default class Peak 
{
  /**
   * creates a peak, defined by a value between 0 (no peak) and 1 (peak), an absolute timer from a defined t point, and an
   * energy. 
   * 
   * @param {number} value [0.0; 1.0] Current value of the peak - decrease over time depending on the interpolation function
   * @param {*} timer Absolute timer on which the peak has been detected.
   * @param {number} energy Strength of the peak
   */
  constructor (value, timer, energy) {
    this.value = value;
    this.timer = timer;
    this.energy = energy;
  }

  /**
   * copies the data from @param peak
   * 
   * @param {Peak} peak data to copy from
   */
  copy (peak) {
    this.value = peak.value;
    this.timer = peak.timer;
    this.energy = peak.energy;
  }
};