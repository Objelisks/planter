const over = d3.select('.over')

export const viewPage = ({ setPage }) => ({
    load: () => {
      over.append('div').text('edit').classed('button', true).on('click touchend', () => setPage('wallsPage'))
      over.append('div').text('list').classed('button', true).on('click touchend', () => setPage('listPage'))
    },
    unload: () => {
      over.selectAll('*').remove()
    }
  })
  