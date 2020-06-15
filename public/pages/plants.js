const zone = d3.select('.zone')
const over = d3.select('.over')
const svg = zone.select('svg')

/*
{"expiration":1592202021,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcCI6WzQ4LDQ2LDQ4LDQ2LDQ4LDQ2LDQ4XSwiaXNzdWVyX2lkIjo1MDcxLCJvcmlnaW4iOiJsb2NhbGhvc3QiLCJhdWQiOiJKb2tlbiIsImV4cCI6MTU5MjIwMjAyMSwiaWF0IjoxNTkyMTk0ODIxLCJpc3MiOiJKb2tlbiIsImp0aSI6IjJvYzlwZzhhMXQ4cGVocWhsODAwMDNjaCIsIm5iZiI6MTU5MjE5NDgyMX0.crinkgIvnJR0XEyZpAZVPjJIroUV37-_a4sSmZ8lcpY"}


*/
const localhostJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcCI6WzQ4LDQ2LDQ4LDQ2LDQ4LDQ2LDQ4XSwiaXNzdWVyX2lkIjo1MDcxLCJvcmlnaW4iOiIqIiwiYXVkIjoiSm9rZW4iLCJleHAiOjE1OTIyMDIyNjIsImlhdCI6MTU5MjE5NTA2MiwiaXNzIjoiSm9rZW4iLCJqdGkiOiIyb2M5cHVhbjUybG1hcGZzOTAwMDAzZDEiLCJuYmYiOjE1OTIxOTUwNjJ9.kowsAVc9O545GGdj7lknU50xo0s0ZksOqb0skWr4m8U'
const token = 'czVucnQyb2k0dVpGczRGMlpNa2RLdz09'
const api = (q) => `https://trefle.io/api/plants?token=${localhostJWT}&q=${q}`

let dragPlant = null
let plantDown = null
let plants = []

const spawnPlant = (x, y) => {
  const plantId = plants.push({ x, y }) - 1
  plants[plantId].id = plantId
  return plantId
}

const findMatches = async (search) => {
  const matches = await fetch(api(search))
    .then(response => response.json())
    .then(data => data.map(plant => plant.common_name || plant.scientific_name))
  console.log(matches)
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

const select = (plant) => {
  plant.selected = true
}

const deselectAll = () => {
  zone.selectAll('.selected').each(d => d.selected = false)
}

const renderInput = () => {
  over.selectAll('input').data(plants.filter(plant => plant.selected)).join(
    enter => enter.append('input')
      .attr('id', 'plantsearch')
      .attr('type', 'text')
      .attr('list', 'searchlist')
      .attr('autocomplete', 'off')
      .attr('placeholder', 'type a plant name...')
      .classed('search', true)
      .attr('value', d => d.name)
      .on('input', () => {
        const newValue = d3.event.target.value
        enter.datum().name = newValue
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

const renderPlants = () => svg.selectAll('.plant').data(plants).join(
    enter => enter.append('circle').classed('plant', true)
      .on('mousedown touchstart', () => {
        plantDown = enter.datum().id
       })
      .on('mouseup touchend', () => {
        deselectAll()
        select(enter.datum())
        render()
      }),
    update => update,
    exit => exit.remove())
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', () => 15)
  .classed('selected', d => d.selected)

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
      setPage('viewPage')
    })
    over.append('datalist').attr('id', 'searchlist')

    zone.on('mousedown touchstart', () => {
      deselectAll()
      render()
    })
    zone.on('mousemove.plant touchmove.plant touchdrag.plant', plantMove)
    zone.on('mouseup.plant touchend.plant mouseleave.plant touchleave.plant', plantEnd)

    render()
  },
  unload: () => {
    over.selectAll('*').on('.', null).remove()
    zone.on('.plant', null)
  }
})
