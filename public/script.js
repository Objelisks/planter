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

// ignore default touch behavior
const touchEvents = ['touchstart', 'touchmove', 'touchend']
touchEvents.forEach((eventName) => {
  document.body.addEventListener(eventName, (e) => {
    e.preventDefault()
  })
})


const line = d3.line()
const zone = d3.select('.zone')
const over = d3.select('.over')

let walls = []
const pages = {}


pages.introPage = {
  load: () => {
    over.append('h1').text('Plan(t)s')
    over.append('div').text('ok ready!!').classed('button', true).on('click', () => setPage(pages.wallPage))
  },
  unload: () => {
    
  }
}


let svg = null

// refresh walls from data
const renderWalls = () =>
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

pages.wallPage = {
  load: () => {
    over.append('div').text('clear').classed('button', true).on('click', () => {
      walls = []
      renderWalls()
    })
    over.append('div').text('done').classed('button', true).on('click', () => setPage(pages.plantsPage))
    
    const width = zone.node().getBoundingClientRect().width
    const height = zone.node().getBoundingClientRect().height
    svg = zone.append('svg')
      .attr('width', width)
      .attr('height', height)
      .on('mousedown.draw', ondraw('mousemove'))
      .on('touchstart.draw', ondraw('touchmove'))
      .on('mouseup.draw touchend.draw mouseleave.draw touchleave.draw', onend)
    renderWalls()
  },
  unload: () => {
  }
}


let activePlant = null

pages.plantsPage = {
  load: () => {
    over.append('div').text('add one').classed('button', true).on('mousedown touchstart', () => activePlant = {})
    over.append('div').text('done').classed('button', true).on('click', () => setPage(pages.viewPage))
    renderWalls()
  },
  unload: () => {}
}


let activePage = pages.introPage
const setPage = (page = activePage) => {
  if(activePage) {
    activePage.unload()
  }
  zone.selectAll('*').remove()
  over.selectAll('*').remove()
  activePage = page
  if(activePage) {
    activePage.load()
  }
}

const resize = () => {
  setPage()
}
window.addEventListener('resize', resize)
resize()