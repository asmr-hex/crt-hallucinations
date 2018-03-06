import {min, range, reduce} from 'lodash'
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
    if (p5.keyCode !== p5.ENTER) return
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

    const radius = min([width, height]) * 0.3
    const origin = {x: width/2, y: height/2}

    // set amplitude and frequency
    // TODO make these variable based on some kewl input
    const amplitude = radius * 0.3
    const frequency = 3 // 5 cycles per second (the circle is 1 second long)
    
    drawCircle(origin, radius * 2)
    drawBoundedWave(origin, radius, amplitude, frequency)
  }

  // TODO implement dashed circle
  const drawCircle = (origin, radius) => {
    p5.noFill()
    p5.stroke(snow)
    p5.ellipse(origin.x, origin.y, radius)
  }

  // use cubic bezier curves to construct the waves
  const drawBoundedWave = (origin, radius, amplitude, frequency) => {

    const dtheta = (2 * Math.PI) / (2 * frequency)
    reduce(
      range(0, 2 * Math.PI, dtheta),
      (point, _) => {
        // compute next 3 bezier control points given point
        const {p0, p1, p2, p3} = computeBezierPoints(
          point, dtheta, origin, radius, amplitude,
        )
        
        // draw bezier curve
        p5.bezier(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)

        // debugging
        p5.fill('red')
        p5.ellipse(
          p5.bezierPoint(p0.x, p1.x, p2.x, p3.x, 0),
          p5.bezierPoint(p0.y, p1.y, p2.y, p3.y, 0),
          10,10)
        p5.fill('green')
        p5.ellipse(
          p5.bezierPoint(p0.x, p1.x, p2.x, p3.x, 1),
          p5.bezierPoint(p0.y, p1.y, p2.y, p3.y, 1),
          10,10)
        p5.fill('white')
        // const p = toCartesianCoords({r: radius, theta: 0}, origin)
        // p5.ellipse(p.x, p.y, 10,10)
        p5.fill('yellow')
        p5.ellipse(p1.x, p1.y, 10,10)
        p5.fill('purple')
        p5.ellipse(p2.x, p2.y, 10,10)
        p5.noFill()

        
        
        // set accumulator (point) to the next starting point
        return toPolarCoords(p3, origin)
      },
      {r: radius + amplitude, theta: 0},
    )
  }

  // computes the next 6 control points given the starting control point
  const computeBezierPoints = (p, dtheta, origin, radius, amplitude) => {
    // for a normal half-cosine wave, the inner two control points will be colinear on
    // the x-axis and the second and third will be colinear with the first and fourth
    // respectively on the y-axis.
    //                   
    //               o _/--o
    //               _/
    //             _/
    //         o--/  o

    const coeff = p.r < radius ? 1 : -1
    
    const p0 = toCartesianCoords(p, origin)
    const p1 = toCartesianCoords({r: radius - coeff * amplitude, theta: p.theta + 0.25 * dtheta}, origin)
    const p2 = toCartesianCoords({r: radius + coeff * amplitude, theta: p.theta + 0.50 * dtheta}, origin)
    const p3 = toCartesianCoords({r: radius + coeff * amplitude, theta: p.theta + 0.75 * dtheta}, origin)
    
    return {p0, p1, p2, p3}
  }

  const toPolarCoords = ({x, y}, origin) => ({
      r: Math.sqrt((x - origin.x)**2 + (y - origin.y)**2),
      theta: -Math.atan((y - origin.y) / (x - origin.x)),
  })

  const toCartesianCoords = ({r, theta}, origin) => {
    return {
      x: (r * Math.cos(2*Math.PI - theta)) + origin.x,
      y: (r * Math.sin(2*Math.PI - theta)) + origin.y,
    }
  }
}
