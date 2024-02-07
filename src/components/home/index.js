import React from 'react';
import { Button, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleAd from '../ads';

const Home = () => {
  return (
    <Paper
      square
      sx={{
        display: 'flex',
        margin: 'auto',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(33, 33, 33)',
      }}
      elevation={0}
    >
      <Grid
        sx={{ width: '100%', height: '100%' }}
        container
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item>
          <GoogleAd
            position="top"
            style={{
              display: 'block',
              width: '728px',
              height: '90px',
            }}
            adSlot="5121779799"
            justOnHome={true}
          />
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <img src="/logo192.png" alt="" />
            </Grid>
            <Link
              style={{ textDecoration: 'none', width: '250px' }}
              to={'/simple-schedule'}
            >
              <Button
                sx={{ mt: 4 }}
                fullWidth
                variant="contained"
                color="primary"
              >
                {'Simple schedule'}
              </Button>
            </Link>
            <Link style={{ textDecoration: 'none', width: '250px' }} to={'/'}>
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                fullWidth
              >
                {'Multiplayer mode (soon)'}
              </Button>
            </Link>
          </Grid>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Paper>
  );
};

export default Home;
