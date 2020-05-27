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

const width = zone.node().getBoundingClientRect().width
const height = zone.node().getBoundingClientRect().height
let svg = zone.append('svg')
  .attr('width', width)
  .attr('height', height)

const pages = {}


pages.introPage = {
  load: () => {
    over.append('h1').text('Plan(t)s')
    over.append('div').text('ok ready!!').classed('button', true).on('click touchend', () => setPage(pages.wallPage))
  },
  unload: () => {
    over.selectAll('*').remove()
  }
}


let walls = []

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
    over.append('div').text('clear').classed('button', true).on('click touchend', () => {
      walls = []
      renderWalls()
    })
    over.append('div').text('done').classed('button', true).on('click touchend', () => setPage(pages.plantsPage))
    
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
}


let activePlant = null
let plants = []

const spawnPlant = (x, y) => {
  const plantId = plants.push({ x, y }) - 1
  plants[plantId].id = plantId
  return plantId
}

const renderPlants = () => svg.selectAll('.plant').data(plants).join(
    enter => enter.append('circle').classed('plant', true)
      .on('mousedown touchstart', () => activePlant = enter.datum().id),
    update => update,
    exit => exit.remove())
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => 15)

const plantMove = () => {
  if(activePlant !== null) {
    const point = d3.event.type.includes('mouse') ? d3.mouse(zone.node()) : d3.touches(zone.node())[0]
    plants[activePlant].x = point[0]
    plants[activePlant].y = point[1]
    renderPlants()
  }
}

const plantEnd = () => {
  activePlant = null
  renderPlants()
}

pages.plantsPage = {
  load: () => {
    // this is kinda weird, maybe i should just put the buttons in svg
    // the touchmove events on zone don't trigger if touchstart happens on the button
    over.append('div').text('add one').classed('button', true)
      .on('mousedown touchstart', () => activePlant = spawnPlant())
      .on('mousemove touchmove', plantMove)
      .on('mouseup touchend', plantEnd)
    over.append('div').text('done').classed('button', true).on('click touchend', () => setPage(pages.viewPage))
    zone.on('mousemove.plant, touchmove.plant touchdrag.plant', plantMove)
    zone.on('touchcancel', () => console.log(d3.event.type))
    zone.on('mouseup.plant touchend.plant mouseleave.plant touchleave.plant', plantEnd)
    renderWalls()
    renderPlants()
  },
  unload: () => {
    over.selectAll('*').remove()
    zone.on('.plant', null)
  }
}


pages.viewPage = {
  load: () => {
    
  },
  unload: () => {
    
  }
}


let activePage = pages.introPage
const setPage = (page = activePage) => {
  if(activePage) {
    activePage.unload()
  }
  
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