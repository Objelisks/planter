import { getFromLocal } from "../utilities.js"

const over = d3.select('.over')

export const introPage = ({ setPage }) => ({
    load: () => {
      over.append('h1').text('Plan(t)s')
      const readyButton = over.append('div').text('ok ready!!').classed('button', true)

      const plantsData = getFromLocal('plants')
      if(plantsData) {
        readyButton.on('click touchend', () => {
          d3.event.preventDefault()
          setPage('viewPage')
        })
      } else {
        readyButton.on('click touchend', () => {
          d3.event.preventDefault()
          setPage('wallsPage')
        })
      }
    },
    unload: () => {
      over.selectAll('*').on('.', null).remove()
    }
  })
  