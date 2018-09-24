
// take a note (keyboard key) and return the frequency
//
const getNoteFreq = function(note) {
  // http://subsynth.sourceforge.net/midinote2freq.html
  const tune = 440;
  return (tune / 32) * Math.pow(2, ((note - 9) / 12));
};

// take a frequency, poly, and detune value and return an array of frequencies
//
const getFrequencySpread = function(freq, poly = 1, detune = 0) {
  const numIntervals = Math.floor(poly / 2);
  
  return Array(poly).fill()
    .map((_, i) => freq + (numIntervals - i) * detune)
    .reverse();
};

// take a range and a percent value, return a point on the range
//
const percentToPoint = function(min, max, percent) {
  const range = max - min;
  const shift = range * percent;
  const point = shift + min;

  return isNaN(point) 
    ? 0 
    : point;
};

// take a range and a point, return the percentage on the range
//
const pointToPercent = function(min, max, point) {
  const range = max - min;
  const shift = point - min;
  const percent = shift / range;

  return isNaN(percent) 
    ? 0 
    : percent;
};

// a non linear equation for converting a value from 0 to 127 to seconds, good for envelopes
// slightly modelled after Reason's Subtractor but needs more tests & research
//
const knobToSeconds = function(value) {
  return Math.pow(value, 5) / 500000000;
};

const knobToFreq = function(value) {
  return Math.pow(value, 2);
};

const freqToKnob = function(value) {
  return Math.sqrt(value);
};

export { getNoteFreq, getFrequencySpread, percentToPoint, pointToPercent, knobToSeconds, knobToFreq, freqToKnob };
