import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';

import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import MainContext from './../Context';

const ACTIONS = [
  { icon: <EventNoteIcon />,
    name: 'New schedule',
    path: '/simple-schedule' },
  { icon: <GroupIcon />,
    name: 'Multiplayer (soon)',
    path: '/' }
];



const Options = () => {
  const { theme, setTheme } = React.useContext(MainContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: "9999"
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {
          ACTIONS.map((action) => (
            <SpeedDialAction
              href={action.path}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={handleClose}
            />
          ))
        }
        {
          theme === 'default' &&
            <SpeedDialAction
              key={'Night mode'}
              icon={<NightlightRoundIcon />}
              tooltipTitle={'Night mode'}
              onClick={() => {
                handleClose();
                setTheme('dark');
              }} />
        }
        {
          theme === 'dark' && 
            <SpeedDialAction
              key={'Day mode'}
              icon={<LightModeRoundedIcon />}
              tooltipTitle={'Day mode'}
              onClick={() => {
                handleClose();
                setTheme('default');
              }}
            />
        }
      </SpeedDial>
    </>
  );
};
export default Options;