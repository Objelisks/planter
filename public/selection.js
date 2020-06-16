
const zone = d3.select('.zone')

let selected = null

export const select = (plant) => {
    selected = plant
    zone.dispatch('selection-change')
}
  
export const deselectAll = () => {
    selected = null
    zone.dispatch('selection-change')
}

export const isSelected = (thing) => {
    return selected === thing
}

export const getSelected = () => selected