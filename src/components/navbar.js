import React, {useState} from 'react'
import {
  Grid,
  AppBar,
  Button,
  Typography,
  Box,
  IconButton
} from '@material-ui/core'
import {HelpOutlined, HelpOutlineOutlined} from '@material-ui/icons/'
import Modal from './modal'

const Navbar = ({handleClick, isLoggedIn}) => {
  const [modal, setModal] = useState({show: true})
  const [navBar, setNavBar] = useState({
    backgroundColor: 'primary',
    padding: '0 1%'
  })
  const [gridContainer, setGridContainer] = useState({
    height: '55px'
  })
  const [buttonText, setButtonText] = useState({
    fontSize: '1.2em',
    color: '#fafafa'
  })

  const flipModal = () => {
    if (modal.show === false) {
      setModal({show: true})
    } else {
      setModal({show: false})
    }
  }

  return (
    <Box component="nav">
      <AppBar position="static" className="navBar">
        <Grid className="gridContainer" container>
          <Grid item>
            <Button href="/">
              <Typography className="buttonText">
                New York City Grocery Isochrone
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Modal
              show={modal.show}
              handleClose={flipModal}
              className="modal"
            />
            <IconButton
              className="buttonText"
              title="Toggle light/dark theme"
              aria-label="Toggle light/dark theme"
              onClick={() => flipModal()}
            >
              {modal.show ? <HelpOutlined /> : <HelpOutlineOutlined />}
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
    </Box>
  )
}

export default Navbar
