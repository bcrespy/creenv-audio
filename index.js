/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * 
 **/

import AudioSource from "./source/audio-source";
import AudioSourceLibrary from "./source/library";
import AudioSourceFile from "./source/file";
import AudioSourceMicrophone from "./source/microphone";
import AudioSourceSoundcloud from "./source/soundcloud";

import AudioStream from "./stream";
import AudioAnalyser from "./analyser";

import AudioAnalysedData from "./audio-analysed-data";


export default {
  AudioSource, AudioSourceFile, AudioSourceLibrary, AudioSourceMicrophone, AudioSourceSoundcloud,
  AudioStream, AudioAnalyser,
  AudioAnalysedData
};