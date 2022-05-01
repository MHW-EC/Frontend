import React, { forwardRef, useState } from 'react';
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTabs from './CalendarTabs';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default (props) => {
  const {
    scheduleInfo,
    numHorario
  } = props;
  const [open, setOpen] = useState(false);

  return scheduleInfo && (
    <Box 
      sx={{
        paddingTop: '16px',
        display: "flex",
        justifyContent: "center"
      }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setOpen(true);
        }}>
        {"SCHEDULE VIEW"}
      </Button>
      {
        open &&
        <Dialog
          fullScreen
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          TransitionComponent={Transition}
        >
          <AppBar sx={{
            position: 'relative',
          }} elevation={0}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setOpen(false);
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{
                marginLeft: theme => theme.spacing(2),
                flex: 1,
              }}>
                Horario
              </Typography>
            </Toolbar>
          </AppBar>
          {
          scheduleInfo && 
          <CalendarTabs
              id="root-visor"
              numHorario={numHorario}
              scheduleInfo={scheduleInfo}
            />
          }
        </Dialog>
      }
    </Box>
  )
}
