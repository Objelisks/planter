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

const state = {
  toolmode: 'plan',
  active: false,
  walls: [],
}

d3.select('.zone')
  .on('mousedown', (event) => {
    state.active = true
    d3.select('.zone').append('div')
      .classed('wall', true)
      .classed('active', true)
  }) 
  .on('mousemove', (event) => {
    d3.select('.active')
  })
  .on('mouseup', (event) => {
    d3.select('.active').classed('active', false)
  })
  .selectAll('.wall').data(state.walls).join(
    enter => enter.append('div').classed('wall', true),
    update => update.attr('path', update),
    exit => exit.remove())