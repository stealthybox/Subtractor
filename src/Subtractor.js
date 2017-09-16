import { Osc } from './Osc'

class Subtractor {
  constructor() {
    console.log('Subtractor constructed')
    const osc1 = new Osc()  // unused atm
    this.context = new AudioContext()

    this.amplifier = this.context.createGain()
    this.filter = this.context.createBiquadFilter()
    this.lfo = this.context.createOscillator()

    this.amplifier.connect(this.context.destination)
    this.filter.connect(this.amplifier)
    this.lfo.connect(this.amplifier.gain)
    

    const presets = {
      harmonic: [
        5.1, 3, 2,
        'lowpass', 1000, 5,
        'triangle', 1,
      ],
      full:     [
        4.5, 5, .2,
        'lowpass', 1000, 5,
        'triangle', 4,
      ],
      simple:     [
        5, 1, 0,
        'lowpass', 1200, 5,
        'sine', 2,
      ],
    }
    this.selectedPreset = presets.simple 
    this.octave    = this.selectedPreset[0]  // floats work for this which is cool because you can change the key
    this.polyphony = this.selectedPreset[1]  // integer between 1 and 10
    this.detune    = this.selectedPreset[2]  // float, between 0 and 1 is a half-step

    this.filter.type = this.selectedPreset[3]
    this.filter.frequency.value = this.selectedPreset[4]
    this.filter.Q.value = this.selectedPreset[5]

    this.lfo.start()
    this.lfo.type = this.selectedPreset[6] 
    this.lfo.frequency.value = this.selectedPreset[7]

    this.handleKeys()
  }

  handleKeys() {
    let keyWasPressed = []
    window.addEventListener('keydown', (eKeyDown) => {
      const octaveKeys = new Map([
        ['a', 0],
        ['w', 1],
        ['s', 2],
        ['e', 3],
        ['d', 4],
        ['f', 5],
        ['t', 6],
        ['g', 7],
        ['y', 8],
        ['h', 9],
        ['u', 10],
        ['j', 11],
        ['k', 12],
        ['o', 13],
        ['l', 14],
        ['p', 15],
        [';', 16],
        ['\'', 17],
      ])
      if (octaveKeys.has(eKeyDown.key) && !keyWasPressed[eKeyDown.key]) {
        const note = octaveKeys.get(eKeyDown.key) + (this.octave * 12)
        const polyNoteOscillators = this.startPolyNote(note)

        // on note-keyup, stop the oscillators
        const stopThisPolyNote = function(eNoteKeyUp) {
          if (eKeyDown.key === eNoteKeyUp.key) {
            polyNoteOscillators.forEach(osc => osc.stop())
            window.removeEventListener('keyup', stopThisPolyNote)
          }
        }
        window.addEventListener('keyup', stopThisPolyNote)
      }

      if (eKeyDown.key == 'z' && this.octave > 0) {
        this.octave--;
      }
      if (eKeyDown.key == 'x' && this.octave < 12) {
        this.octave++;
      }

      keyWasPressed[eKeyDown.key] = true
    })
    window.addEventListener('keyup', (eKeyUp) => {
      keyWasPressed[eKeyUp.key] = false
    })
  }

  startPolyNote(note) {
    // number of intervals on the upper side of the root note
    const numIntervals = Math.floor(this.polyphony / 2)
    // width of interval based on the detune and polyphony measured in notes
    const interval = numIntervals == 0
      ? 0
      : this.detune / numIntervals
      // ternary gaurds interval being Infinity

    // create n=polyphony oscillators
    return Array(this.polyphony).fill()
      .map((_,i) => note + (numIntervals - i) * interval)
      .reverse()
      .map(this.getNoteFreq)
      .map(this.startFreqOscillator.bind(this))
  }
  
  startFreqOscillator(freq) {
    const oscillator = this.context.createOscillator()
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = freq;
    oscillator.connect(this.filter);
    oscillator.start();
    return oscillator
  }

  getNoteFreq(note) {
    // http://subsynth.sourceforge.net/midinote2freq.html
    const tune = 440
    return (tune / 32) * Math.pow(2, ((note - 9) / 12))
  }
}

window.Subtractor = Subtractor
