import React from 'react';
import { Button, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Paper
      square
      sx={{
        display: 'flex',
        margin: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(33, 33, 33)',
      }}
      elevation={0}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <img src="/logo192.png" alt="" />
        </Grid>
      </Grid>
      <Link
        style={{ textDecoration: 'none', width: '250px' }}
        to={'/simple-schedule'}
      >
        <Button sx={{ mt: 4 }} fullWidth variant="contained" color="primary">
          {'Simple schedule'}
        </Button>
      </Link>
      <Link style={{ textDecoration: 'none', width: '250px' }} to={'/'}>
        <Button sx={{ mt: 2 }} variant="contained" color="primary" fullWidth>
          {'Multiplayer mode (soon)'}
        </Button>
      </Link>
    </Paper>
  );
};

export default Home;
