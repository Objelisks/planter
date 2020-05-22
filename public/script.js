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

const makeLine = d3.line()

const state = {
  toolmode: 'plan',
}

const walls = []

const zone = d3.select('.zone')
const svg = zone.append('svg').attr('width', 800).attr('height', 600)

const renderWalls = () =>
  svg
    .selectAll('.wall')
    .data(walls)
    .join(
      enter => enter.append('path').classed('wall', true).attr('d', d => makeLine(d)),
      update => update.attr('d', d => makeLine(d)),
      exit => exit.remove())
  
zone.on('mousedown', () => {
  walls.push([])
  
  zone.on('mousemove.draw', () => {
    walls[walls.length-1].push(d3.mouse(zone.node()))
    renderWalls()
  })
  
  renderWalls()
})
.on('mouseup', () => {
  zone.on('mousemove.draw', null)
  const simplified = simplify(walls[walls.length-1], 1)
  walls[walls.length-1] = simplified
  renderWalls()
})

renderWalls()