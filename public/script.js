/* globals d3 */
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

const makeLine = d3.path()

const state = {
  toolmode: 'plan',
}

d3.select('.zone')
  .data({ walls: [] })
  .on('mousedown', (data) => {
  console.log('etc', data)
    data.walls.push([d3.mouse(this)])
  }) 
  .on('mousemove', (data) => {
    data.walls[data.walls.length-1].push(d3.mouse(this))
  })
  .selectAll('.wall').data(data => data.walls).join(
    enter => enter.append('div').classed('wall', true),
    update => data => update.attr('path', makeLine(data)),
    exit => exit.remove())