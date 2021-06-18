import React, {useState, useEffect, useRef, useCallback} from 'react'
import MapGL, {Source, Layer, NavigationControl} from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import {pointStyles, isochroneStyles} from '../styles/mapStyles'
import axios from 'axios'

const accessToken = process.env.REACT_APP_MAPBOX_API_KEY

const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/'

const Map = () => {
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    latitude: 40.837222,
    longitude: -73.886111,
    zoom: 12,
    minZoom: 2
  })
  const [isochroneCoordinates, setIsochroneCoordinates] = useState({
    latitude: viewport.latitude,
    longitude: viewport.longitude
  })
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [offset, setOffset] = useState({x: null, y: null})
  const [grocers, setGrocers] = useState(null)
  const [profile, setProfile] = useState('walking')
  const [minutes, setMinutes] = useState(10)
  const [buroughs, setBuroughs] = useState([
    'https://data.ny.gov/resource/9a8c-vfzj.json?county=Bronx',
    'https://data.ny.gov/resource/9a8c-vfzj.json?county=Kings',
    'https://data.ny.gov/resource/9a8c-vfzj.json?county=New%20York',
    'https://data.ny.gov/resource/9a8c-vfzj.json?county=Queens',
    'https://data.ny.gov/resource/9a8c-vfzj.json?county=Richmond'
  ])

  const mapRef = useRef()
  const geocoderContainerRef = useRef()
  const sidebarContainerRef = useRef()

  const _handleTimeChange = event => {
    setMinutes(event.target.value)
  }

  const _onViewportChange = viewport => {
    setViewport({...viewport})
  }

  const _onHover = event => {
    const {features, srcEvent: {offsetX, offsetY}} = event
    const hoveredFeature =
      features && features.find(f => f.layer.id === 'grocers')
    setHoveredFeature(hoveredFeature)
    setOffset({x: offsetX, y: offsetY})
  }

  const _renderTooltip = () => {
    return (
      hoveredFeature && (
        <div className="tooltip" style={{left: offset.x, top: offset.y}}>
          <div>Name: {hoveredFeature.properties.name}</div>
          <div>
            Address: {hoveredFeature.properties.street_number}{' '}
            {hoveredFeature.properties.street_name}
          </div>
          <div>County: {hoveredFeature.properties.county}</div>
          <div>State:{hoveredFeature.properties.state}</div>
        </div>
      )
    )
  }

  const _onIsochroneClick = event => {
    setIsochroneCoordinates({
      latitude: event.lngLat[1],
      longitude: event.lngLat[0]
    })
  }

  const handleViewportChange = useCallback(
    newViewport => setViewport(newViewport),
    []
  )

  const handleGeocoderViewportChange = useCallback(newViewport => {
    const geocoderDefaultOverrides = {transitionDuration: 1000}
    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides
    })
  }, [])

  useEffect(() => {
    async function grabData() {
      try {
        let geojson = {
          type: 'FeatureCollection',
          features: []
        }
        for (let i = 0; i < buroughs.length; i++) {

          const {data} = await axios.get(buroughs[i])
          const grocers = {
            type: 'FeatureCollection',
            features: data
              .filter(
                grocer =>
                  grocer.location !== undefined &&
                  grocer.location.latitude !== undefined &&
                  grocer.location.longitude !== undefined
              )
              .map((grocer, index) => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [
                    parseFloat(grocer.location.longitude),
                    parseFloat(grocer.location.latitude)
                  ]
                },
                properties: {
                  id: index + 1,
                  name: grocer.dba_name,
                  address: grocer.location.human_address,
                  street_number: grocer.street_number,
                  street_name: grocer.street_name,
                  city: grocer.city,
                  county: grocer.county,
                  state: grocer.state
                }
              }))
          }
          geojson.features.push(...grocers.features)
        }
        setGrocers(geojson)
      } catch (error) {
          console.error(error.message)
      }
    }
    grabData()
  }, [])

  return (
    <div>
      <div>
        <div className="mapContainer">
          <div ref={geocoderContainerRef} className="geocoderContainer" />
          <MapGL
            ref={mapRef}
            {...viewport}
            mapboxApiAccessToken={accessToken}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={_onViewportChange}
            onClick={_onIsochroneClick}
            onHover={_onHover}
          >
            <Source id="ny-grocers" type="geojson" data={grocers}>
              <Layer {...pointStyles} />
            </Source>
            <div>{_renderTooltip()}</div>
            <Source
              id="iso"
              type="geojson"
              data={
                urlBase +
                profile +
                '/' +
                isochroneCoordinates.longitude +
                ',' +
                isochroneCoordinates.latitude +
                '?contours_minutes=' +
                minutes +
                '&polygons=true&access_token=' +
                accessToken
              }
            >
              <Layer {...isochroneStyles} />
            </Source>
            <Geocoder
              mapRef={mapRef}
              containerRef={geocoderContainerRef}
              onViewportChange={handleGeocoderViewportChange}
              mapboxApiAccessToken={accessToken}
              style={{display: 'none'}}
              position="top-left"
            />
            <div className="navStyle">
              <NavigationControl />
            </div>
          </MapGL>
          <div className="sidebar" ref={sidebarContainerRef}>
            <label>
              {' '}
              Maximum Travel Time: {minutes} minutes {profile}{' '}
            </label>
            <input
              name="time"
              type="range"
              min={5}
              max={60}
              defaultValue={10}
              onChange={_handleTimeChange}
              step="1"
            />
            <button onClick={() => setProfile('walking')}>Walking</button>
            <button onClick={() => setProfile('cycling')}>Cycling</button>
            <button onClick={() => setProfile('driving')}>Driving</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map
