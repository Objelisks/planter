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

const walls = []

const svg = d3.select('.zone')
  .append('svg')
    .attr("width", 800)
    .attr("height", 600)

svg
  .on('mousedown', (data) => {
    console.log('wtc', walls)
    walls.push([d3.mouse(svg)])
    svg.on('mousemove.draw', data => {
      walls[walls.length-1].push(d3.mouse(svg))
    })
  })
  .on('mouseup', data => {
    svg.on('mousemove.draw', null)
  })
  .selectAll('.wall').data(walls).join(
    enter => enter.append('path').classed('wall', true),
    update => data => {console.log(data); update.attr('d', d3.line(data)) },
    exit => exit.remove())