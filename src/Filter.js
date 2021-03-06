class Filter {
    constructor(context, type=1, freq=22050, gain=0) {
      console.log('Filter constructed')
      this.context = context
      this.filter = context.createBiquadFilter()

      this.filterTypes = new Map([
        [1, 'lowpass'],
        [2, 'highpass'],
        [3, 'bandpass'],
        [4, 'lowshelf'],
        [5, 'highshelf'],
        [6, 'peaking'],
        [7, 'notch'],
        [8, 'allpass']
      ])

      this.setType(type)
      this.setFreq(freq)
      this.setGain(gain)
    }

    setType(value) {
      const key = parseInt(value)
      if (this.filterTypes.has(key)) {
        this.filter.type = this.filterTypes.get(key)
      } else {
        throw Error(`Filter key ${key} not recognized`)
      }
    }

    setFreq(value) {
      this.filter.frequency.value = value
    }

    setQ(value) {
      this.filter.Q.value = value / 10
    }

    setGain(value) {
      this.filter.gain.value = value
    }

    getType() {
      return this.filter.type
    }

    getTypeInput() {
      for (const [key, value] of this.filterTypes) {
        if (value === this.getType()) {
          return key
        }
      }
      return 0
    }

    getFreq() {
      return this.filter.frequency.value
    }

    getQ() {
      return this.filter.Q.value
    }

    getQInput() {
      return this.getQ() * 10
    }

    getGain() {
      return this.filter.gain.value
    }
}

export { Filter }
