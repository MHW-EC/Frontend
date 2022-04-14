import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';

import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeIcon from '@mui/icons-material/LightMode';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import MainContext from './../Context';

const ACTIONS = [
  { icon: <EventNoteIcon />, name: 'New schedule', path: '/simple-schedule' },
  { icon: <GroupIcon />, name: 'Multiplayer (soon)', path: '/' }
];

const Options = () => {
  const { lightMode, toogleLightMode } = React.useContext(MainContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: 'absolute',
          bottom: '24px',
          right: '24px'
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
          lightMode
            ? <SpeedDialAction
              key={"Night mode"}
              icon={<NightlightRoundIcon />}
              tooltipTitle={"Night mode"}
              onClick={() => {
                handleClose();
                toogleLightMode();
              }} />
            : <SpeedDialAction
              key={"Day mode"}
              icon={<LightModeIcon />}
              tooltipTitle={"Day mode"}
              onClick={() => {
                handleClose();
                toogleLightMode();
              }}
            />
        }
      </SpeedDial>
    </>
  );
}
export default Options;