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

const svg = d3.select('.zone').append('svg')
    .attr("width", 800)
    .attr("height", 600)

svg
  .data({ walls: [] })
  .on('mousedown', (data) => {
    data.walls.push([d3.mouse(this)])
    svg.on('mousemove.draw', data => {
      data.walls[data.walls.length-1].push(d3.mouse(this))
    })
  })
  .on('mouseup', data => {
    svg.on('mousemove.draw', null)
  })
  .selectAll('.wall').data(data => data.walls).join(
    enter => enter.append('path').classed('wall', true),
    update => data => update.attr('d', d3.line()),
    exit => exit.remove())