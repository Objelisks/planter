 import { saveToLocal, getFromLocal } from '../utilities.js'
 import { select, deselectAll, isSelected } from '../selection.js'
 import { getPlants } from '../trefle.js'

const zone = d3.select('.zone')
const over = d3.select('.over')
const svg = zone.select('svg')

let dragPlant = null
let plantDown = null
let plants = getFromLocal('plants') || []

const spawnPlant = (x, y) => {
  const plantId = plants.push({ x, y }) - 1
  plants[plantId].id = plantId
  return plantId
}

const findMatches = async (search) => {
  const matches = await getPlants(search)
  d3.select('#searchlist').selectAll('option').data(matches).join('option')
    .attr('value', d => d)
  const input = d3.select('#plantsearch')
  input.node().dispatchEvent(new Event('focus'))
}

const clearMatches = () => {
  d3.select('#searchlist').selectAll('option').remove()
}

let latestTimeout = null
let timeout = 500
const debounce = (func, ...args) => {
  if(latestTimeout) {
    clearTimeout(latestTimeout)
  }
  latestTimeout = setTimeout(() => func(...args), timeout)
}

const renderInput = () => {
  over.selectAll('input').data(plants.filter(plant => isSelected(plant))).join(
    enter => enter.append('input')
      .attr('id', 'plantsearch')
      .attr('type', 'text')
      .attr('list', 'searchlist')
      .attr('autocomplete', 'off')
      .attr('placeholder', 'type a plant name...')
      .classed('search', true)
      .attr('value', d => d.name)
      .on('input', (datum) => {
        const newValue = d3.event.target.value
        datum.name = newValue
        if(newValue === "") {
          clearMatches()
        } else {
          debounce(findMatches, newValue)
        }
      }),
    update => update,
    exit => exit.remove()
  )
}

export const renderPlants = () => {
  svg.selectAll('.plant').data(plants).join(
    enter => enter.append('circle').classed('plant', true)
      .on('mousedown touchstart', (datum) => {
        plantDown = datum.id
       })
      .on('mouseup touchend', (datum) => {
        deselectAll()
        select(datum)
      }),
    update => update,
    exit => exit.remove())
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', () => 15)
  .classed('selected', d => isSelected(d))
}

const render = () => {
  renderPlants()
  renderInput()
}

const plantMove = () => {
  if(plantDown !== null && dragPlant === null) {
    dragPlant = plantDown
  }
  if(dragPlant !== null) {
    const point = d3.event.type.includes('mouse') ? d3.mouse(zone.node()) : d3.touches(zone.node())[0]
    plants[dragPlant].x = point[0]
    plants[dragPlant].y = point[1]
    render()
  }
}

const plantEnd = () => {
  dragPlant = null
  plantDown = null
}

export const plantsPage = ({ setPage }) => ({
  load: () => {
    plantEnd()
    // this is kinda weird, maybe i should just put the buttons in svg
    // the touchmove events on zone don't trigger if touchstart happens on the button

    // "Add one" button
    over.append('div').text('add one').classed('button', true)
      .on('mousedown touchstart', () => {
        plantDown = spawnPlant()
        deselectAll()
        select(plants[plantDown])
        render()
      })
      .on('mousemove touchmove', plantMove)
      .on('mouseup touchend', plantEnd)

    // "Done" button
    over.append('div').text('done').classed('button', true).on('click touchend', () => {
      dragPlant = null
      deselectAll()
      render()
      saveToLocal('plants', plants)
      setPage('viewPage')
    })
    over.append('datalist').attr('id', 'searchlist')

    zone.on('mousedown touchstart', () => {
      deselectAll()
      render()
    })
    zone.on('mousemove.plant touchmove.plant touchdrag.plant', plantMove)
    zone.on('mouseup.plant touchend.plant mouseleave.plant touchleave.plant', plantEnd)
    
    zone.on('selection-change', () => render())
    
    render()
  },
  unload: () => {
    over.selectAll('*').on('.', null).remove()
    zone.on('.plant', null)
  }
})
