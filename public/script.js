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

import { introPage } from './pages/intro.js'
import { wallsPage } from './pages/walls.js'
import { plantsPage } from './pages/plants.js'
import { viewPage } from './pages/view.js'

const pages = {
  introPage,
  wallsPage,
  plantsPage,
  viewPage
}

let activePage = null
const setPage = (page = 'introPage') => {
  if(activePage) {
    activePage.unload()
  }
  
  activePage = pages[page]({ setPage })
  
  if(activePage) {
    activePage.load()
  }
}

const zone = d3.select('.zone')

const resize = () => {
  const width = zone.node().getBoundingClientRect().width
  const height = zone.node().getBoundingClientRect().height
  zone.select('svg')
    .attr('width', width)
    .attr('height', height)
}
resize()
setPage()