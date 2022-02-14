
import React from 'react';
import {
  Button,
} from '@mui/material';
import {
  Link
} from "react-router-dom";

const Home = (props) => {
  return (
    <div>
      <div>
        <Link
          to={'/simple-schedule'}
          underline="none">
          <Button
            color="inherit">
            {"Simple schedule"}
          </Button>
        </Link>
      </div>
      <div>
        <Link
          to={'/'}
          underline="none">
          <Button
            color="inherit"
          >
            {"Multiplayer mode (soon)"}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Home;