import { Observable } from './Observe'
import { knobToSeconds } from './utils/maths'

class Envelope extends Observable {
    constructor(context, audioParam) {
      super()

      this.context = context
      this.audioParam = audioParam
      // the following should work, but we need to convert that scientific notation to a value somehow
      // this.maxValue = audioParam.maxValue
      // this.minValue = audioParam.minValue
      this.maxValue = 1
      this.minValue = 0
      this._attack = 0
      this._decay = 40
      this._sustain = 0
      this._release = 40
    }

    // schedule handles the ADS of the ADSR envelope
    //
    schedule() {
      // how far to drop down for the sustain
      const sustainPercent = this._sustain * (100 / 127) * .01

      // reset value to 0
      this.audioParam.setValueAtTime(0, this.context.currentTime)

      // ramp up to max value from attack
      this.audioParam.linearRampToValueAtTime(this.maxValue, this.context.currentTime + knobToSeconds(this._attack))

      // ramp down to sustain value
      this.audioParam.linearRampToValueAtTime(this.maxValue * sustainPercent, this.context.currentTime + knobToSeconds(this._attack + this._decay))
    }

    // reset handles the R of the ADSR envelope
    //
    reset() {
      // kill all current scheduled values and reset to current value
      this.audioParam.cancelScheduledValues(this.context.currentTime)
      this.audioParam.setValueAtTime(this.audioParam.value, this.context.currentTime)

      // start decay from current value to min
      this.audioParam.linearRampToValueAtTime(this.minValue, this.context.currentTime + knobToSeconds(this._release))
    }

    set attack(value) {
      this._attack = value
    }

    get attack() {
      return this._attack
    }

    set decay(value) {
      this._decay = value
    }

    get decay() {
      return this._decay
    }

    set sustain(value) {
      this._sustain = value
    }

    get sustain() {
      return this._sustain
    }

    set release(value) {
      this._release = value
    }

    get release() {
      return this._release
    }
}

export { Envelope }
