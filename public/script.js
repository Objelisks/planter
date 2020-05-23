/* globals d3 simplify */
/*

plant planner:
draw plan of space
place plants
pull plant data from api
auto complete plant names
plant data table:
  name, water frequency, sunlight pref, acquired


stretch goals:
place furniture, rotate objects
option to identify plants by picture, api
notifications, scheduling, calendar
wiggly animated borders


layout:
zoomable canvas
find bounds of drawn layout
place datatable to the right
place search bar to the top
place tools to the top
big playful controls with transitions

tools:
layout
plant


d3:
path
zoomable
dragging
selection

*/

const line = d3.line()

const zone = d3.select('.zone')
const svg = zone.append('svg').attr('width', 800).attr('height', 600)

const walls = []

const targetPoint = () => d3.event.type === 'mouse' ? d3.mouse(target)

// refresh walls from data
const renderWalls = () =>
  svg
    .selectAll('.wall')
    .data(walls)
    .join(
      enter => enter.append('path').classed('wall', true).attr('d', d => line(d)),
      update => update.attr('d', d => line(d)),
      exit => exit.remove())

// setup events for wall drawing
const ondraw = (type) => {
  walls.push([])
  
  zone.on(`${type}.draw`, () => {
    walls[walls.length-1].push(d3.mouse(zone.node()))
    renderWalls()
  })
  
  renderWalls()
}
const onend = (type) => {
  zone.on(`${type}.draw`, null) // clear move listener
  const simplified = simplify(walls[walls.length-1], 1)
  walls[walls.length-1] = simplified
  renderWalls()
}
zone.on('mousedown.draw', ondraw('mousemove'))
zone.on('touchstart.draw', ondraw('touchmove'))
zone.on('mouseup.draw', onend('mousemove'))
zone.on('touchend.draw', onend('touchmove'))
zone.on('mouseleave.draw', onend('mousemove'))
zone.on('touchend.draw', onend('touchmove'))


// draw everything on initial render
renderWalls()