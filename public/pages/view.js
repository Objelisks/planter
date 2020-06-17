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
        deselectAll()
        setPage('wallsPage')
      })
      renderWalls()
      renderPlants()
      zone.on('selection-change', () => {
        renderPlants()
        renderLabel()
      })
      zone.on('mousedown touchstart', () => {
        deselectAll()
        renderPlants()
        renderLabel()
      })
    },
    unload: () => {
      over.selectAll('*').remove()
    }
  })
  