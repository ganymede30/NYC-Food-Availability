import React from 'react'

const Modal = ({handleClose, show, children}) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none'

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button id="x" onClick={handleClose}>
          {' '}
          X{' '}
        </button>
        <h1 style={{textAlignVertical: 'center', textAlign: 'center'}}>
          {' '}
          Welcome to New York City Food Availablity
        </h1>
        <p>
          This application shows the user's proximity to grocery stores in New
          York City. The green points on the map represent grocery stores and
          hovering your mouse over any of these points will reveal the name and
          address of that grocery store.
        </p>
        <p>
          By clicking anywhere on the map a new isochrone will be generated. The
          slider in the top right corner allows to modify your travel time and
          form of transportation.
        </p>
        <p>
          You can search for specific addresses in the top left corner. Grocery
          store data is only displayed in New York City, but the isochrones work
          anywhere in the world!
        </p>
      </section>
    </div>
  )
}

export default Modal
