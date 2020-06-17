/* globals d3, simplify */

import { saveToLocal, getFromLocal } from '../utilities.js'

const zone = d3.select('.zone')
const over = d3.select('.over')
const svg = zone.select('svg')
const line = d3.line()

let walls = getFromLocal('walls') || []

// refresh walls from data
export const renderWalls = () =>
  svg
    .selectAll('.wall')
    .data(walls)
    .join(
      enter => enter.append('path').classed('wall', true),
      update => update,
      exit => exit.remove())
    .attr('d', d => line(d))

// setup events for wall drawing
const ondraw = (type) => () => {
  walls.push([])
  
  zone.on(`${type}.draw`, () => {
    const point = d3.event.type.includes('mouse') ? d3.mouse(zone.node()) : d3.touches(zone.node())[0]
    walls[walls.length-1].push(point)
    renderWalls()
  })
  
  renderWalls()
}
const onend = () => {
  zone.on('mousemove.draw touchmove.draw', null) // clear move listener
  if(walls.length > 0) {
    const simplified = simplify(walls[walls.length-1], 1)
    walls[walls.length-1] = simplified
    renderWalls()
  }
}

export const wallsPage = ({ setPage }) => ({
  load: () => {
    over.append('div').text('clear').classed('button', true).on('click touchend', () => {
      walls = []
      renderWalls()
    })
    over.append('div').text('done').classed('button', true).on('click touchend', () => {
      saveToLocal('walls', walls)
      setPage('plantsPage')
    })
    over.append('div').text('draw your space layout with the mouse/touch!')
    
    zone
      .on('mousedown.draw', ondraw('mousemove'))
      .on('touchstart.draw', ondraw('touchmove'))
      .on('mouseup.draw touchend.draw mouseleave.draw touchleave.draw', onend)
    renderWalls()
  },
  unload: () => {
    over.selectAll('*').remove()
    zone.on('.draw', null)
  }
})
