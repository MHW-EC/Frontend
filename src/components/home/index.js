
import React from 'react';
import {
  Button,
  Typography,
  Box
} from '@mui/material';
import {
  Link
} from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        margin: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Typography
        variant="h1">
        {'MHW'}
      </Typography>
      <Link
        style={{ textDecoration: 'none' }}
        to={'/simple-schedule'}>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary">
          {'Simple schedule'}
        </Button>
      </Link>
      <Link
        style={{ textDecoration: 'none' }}
        to={'/'}>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
        >
          {'Multiplayer mode (soon)'}
        </Button>
      </Link>
    </Box>
  );
};

export default Home;