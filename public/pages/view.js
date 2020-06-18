import { renderWalls } from "./walls.js"
import { renderPlants } from "./plants.js"
import { deselectAll, getSelected } from '../selection.js'

const zone = d3.select('.zone')
const over = d3.select('.over')

const renderLabel = () => {
  const selected = getSelected()
  over.selectAll('.label').data(selected ? [selected] : []).join(
    enter => enter.append('div')
      .classed('label', true)
      .text(d => d.name)
  )
}

export const viewPage = ({ setPage }) => ({
    load: () => {
      over.append('div').text('edit').classed('button', true).on('click touchend', () => {
        d3.event.preventDefault()
        deselectAll()
        setPage('wallsPage')
      })
      renderWalls()
      renderPlants()
      zone.on('selection-change.view', () => {
        renderPlants()
        renderLabel()
      })
      zone.on('mousedown.view touchstart.view', () => {
        deselectAll()
        renderPlants()
        renderLabel()
      })
    },
    unload: () => {
      over.selectAll('*').remove()
      zone.on('.', null)
    }
  })
  