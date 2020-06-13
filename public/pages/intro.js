const over = d3.select('.over')

export const introPage = ({ setPage }) => ({
    load: () => {
      over.append('h1').text('Plan(t)s')
      over.append('div').text('ok ready!!').classed('button', true).on('click touchend', () => setPage('wallsPage'))
    },
    unload: () => {
      over.selectAll('*').remove()
    }
  })
  