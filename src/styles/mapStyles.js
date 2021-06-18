export const pointStyles = {
  id: 'grocers',
  type: 'circle',
  source: 'ny-grocers',
  paint: {
    'circle-radius': 3,
    'circle-color': 'green'
  },
  filter: ['==', '$type', 'Point'],
  interactive: 'true'
}

export const isochroneStyles = {
  id: 'isoLayer',
  type: 'fill',
  source: 'iso',
  layout: {},
  paint: {
    'fill-color': '#5a3fc0',
    'fill-opacity': 0.3
  }
}
