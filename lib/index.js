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


export default {
  AudioSource, AudioSourceFile, AudioSourceLibrary, AudioSourceMicrophone, AudioSourceSoundcloud,
  AudioStream
};