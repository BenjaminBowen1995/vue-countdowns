import Vue from 'vue'
import Countdown from '@/components/Countdown'

function constructWithProps (remaining, description) {
  const Constructor = Vue.extend(Countdown)
  return new Constructor({ propsData: { remaining, description } }).$mount()
}

function classListForRemaining (remaining) {
  return constructWithProps(remaining).$el.classList
}

describe('Countdown.vue', () => {
  it('should render correct contents', () => {
    const vm = constructWithProps(123, 'desc')
    expect(vm.$el.querySelector('.description').textContent).to.equal('desc')
    expect(vm.$el.querySelector('.remaining').textContent).to.equal('2m 3s')
  })

  it('should have status class of "done" and no others when the remaining duration is zero', () => {
    const cl = classListForRemaining(0)
    expect(cl.contains('done')).to.be.true
    expect(cl.contains('ending')).to.be.false
    expect(cl.contains('running')).to.be.false
  })

  it('should have status class of "ending" and no others when the remaining duration is approaching zero', () => {
    [1, 3].forEach(remaining => {
      const cl = classListForRemaining(remaining)
      const msg = `when ${remaining}`
      expect(cl.contains('done'), `done ${msg}`).to.be.false
      expect(cl.contains('ending'), `ending ${msg}`).to.be.true
      expect(cl.contains('running'), `runnning ${msg}`).to.be.false
    })
  })

  it('should have status class of "running" and no others when the remaining duration is not approaching zero', () => {
    [4, 5, 99, 999999].forEach(remaining => {
      const cl = classListForRemaining(remaining)
      const msg = `when ${remaining}`
      expect(cl.contains('done'), `done ${msg}`).to.be.false
      expect(cl.contains('ending'), `ending ${msg}`).to.be.false
      expect(cl.contains('running'), `runnning ${msg}`).to.be.true
    })
  })
  it('should format the remaining duration correctly', () => {
    [
      [-1, 'done'],
      [0, 'done'],
      [1, '1s'],
      [59, '59s'],
      [60, '1m 0s'],
      [119, '1m 59s'],
      [120, '2m 0s'],
      [3599, '59m 59s'],
      [3600, '1h 0m 0s'],
      [3661, '1h 1m 1s'],
      [7322, '2h 2m 2s'],
      [59 + (59 * 60) + (23 * 60 * 60), '23h 59m 59s'],
      [24 * 60 * 60, '1d 0h 0m 0s'],
      [7 + (0 * 60) + (19 * 60 * 60) + (11 * 24 * 60 * 60), '11d 19h 0m 7s']
    ].forEach(([remaining, formatted]) => {
      const vm = constructWithProps(remaining)
      const msg = `when ${remaining}`
      expect(vm.$el.querySelector('.remaining').textContent, msg).to.equal(formatted)
    })
  })
})
