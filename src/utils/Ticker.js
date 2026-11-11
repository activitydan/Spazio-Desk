import Emitter from './Emitter'

import { gsap } from 'gsap/gsap-core'

class Ticker {
  /**
   * Constructor
   */
  constructor () {
    this.callbacks = []

    this.delta = 0
  }

  /**
   * Init
   */
  init () {
    gsap.ticker.add(this.tick.bind(this))
  }

  /**
   * Tick
   */
  tick(time, delta) {
    this.delta = delta

    // Start a fresh list for the callbacks queued from here on (they
    // run next tick, as before). The list used to be kept forever with
    // each spent entry deleted in place, so it grew by one hole per
    // scroll event and every tick had to step over all of them: the
    // longer the page had been scrolled, the slower each frame got.
    const callbacks = this.callbacks
    this.callbacks = []

    callbacks.forEach((object) => {
      object.callback.apply(object.context)
    })

    Emitter.emit('tick', time * 1000)
  }

  /**
   * Next tick
   */
  nextTick (callback, context) {
    this.callbacks.push({
      callback,
      context
    })
  }
}

export default new Ticker()
