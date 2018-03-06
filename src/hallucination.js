import {min} from 'lodash'
import {
  grey,
  snow,
} from './palette'

export const hallucination = p5 => {
  // get the width and height from p5 and set p5 in the window
  let width = p5.windowWidth
  let height = p5.windowHeight
  window.p5 = p5

  p5.setup = () => {
    // create the p5 canvas
    p5.createCanvas(width, height)
  }

  // toggle fullscreen on any keypress
  p5.keyPressed = () => {
    const fs = p5.fullscreen()
    p5.fullscreen(!fs)
  }

  // resize canvas on window resize
  p5.windowResized = () => {
    width = p5.windowWidth
    height = p5.windowHeight
    p5.resizeCanvas(width, height)
  }
  
  p5.draw = () => {
    // redraw background
    p5.background(grey)

    const radius = min([width, height]) * 0.70
    const origin = {x: width/2, y: height/2}

    // set amplitude and frequency
    // TODO make these variable based on some kewl input
    const amplitude = radius * 0.50
    const frequency = 5 // 5 cycles per second (the circle is 1 second long)
    
    drawCircle(origin, radius)
    drawBoundedWave(origin, radius, amplitude, frequency)
  }

  // TODO implement dashed circle
  const drawCircle = (origin, radius) => {
    p5.noFill()
    p5.stroke(snow)
    p5.smooth()
    p5.ellipse(origin.x, origin.y, radius)
  }

  const drawBoundedWave = (origin, radius, amplitude, frequency) => {
    p5.curve()
  }
  
}
