const zone = d3.select('.zone')
const over = d3.select('.over')
const svg = zone.select('svg')

let dragPlant = null
let selectPlant = null
let plantDown = null
let plants = []

const spawnPlant = (x, y) => {
  const plantId = plants.push({ x, y }) - 1
  plants[plantId].id = plantId
  return plantId
}

const renderPlants = () => svg.selectAll('.plant').data(plants).join(
    enter => enter.append('circle').classed('plant', true)
      .on('mousedown touchstart', () => { console.log(enter.datum()); plantDown = enter.datum().id} )
      .on('mouseup touchend', () => selectPlant = enter.datum().id),
    update => update,
    exit => exit.remove())
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', () => 15)
  .classed('selected', d => d.id === selectPlant)

const plantMove = () => {
  if(plantDown !== null && dragPlant === null) {
    dragPlant = plantDown
  }
  if(dragPlant !== null) {
    const point = d3.event.type.includes('mouse') ? d3.mouse(zone.node()) : d3.touches(zone.node())[0]
    plants[dragPlant].x = point[0]
    plants[dragPlant].y = point[1]
    renderPlants()
  }
}

const plantEnd = () => {
  if(plantDown === null) {
    selectPlant = null
  }
  dragPlant = null
  plantDown = null
  renderPlants()
}

export const plantsPage = ({ setPage }) => ({
  load: () => {
    // this is kinda weird, maybe i should just put the buttons in svg
    // the touchmove events on zone don't trigger if touchstart happens on the button
    over.append('div').text('add one').classed('button', true)
      .on('mousedown touchstart', () => plantDown = spawnPlant())
      .on('mousemove touchmove', plantMove)
      .on('mouseup touchend', plantEnd)
    over.append('div').text('done').classed('button', true).on('click touchend', () => {
      dragPlant = null
      setPage('viewPage')
    })
    zone.on('mousemove.plant touchmove.plant touchdrag.plant', plantMove)
    zone.on('mouseup.plant touchend.plant mouseleave.plant touchleave.plant', plantEnd)
    renderPlants()
  },
  unload: () => {
    over.selectAll('.button').on('.', null).remove()
    zone.on('.plant', null)
  }
})
