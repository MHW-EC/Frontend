
import React, { useContext } from 'react';
import MainContext from './../Context';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import {
  Link
} from "react-router-dom";

const SIDE_BAR_ORIENTATION = 'left';
const SIDE_BAR_ITEMS = [
  {
    label: "Home",
    path: '/',
    icon: () => <HomeIcon />
  },
  {
    label: "Simple schedule",
    path: '/simple-schedule',
    icon: () => <EventNoteIcon />
  },
  {
    label: "Multiplayer (Soon)",
    path: '/',
    icon: () => <GroupIcon />
  }
]

const SideBar = () => {
  const {
    sideBarIsOpen, toogleSideBar
  } = useContext(MainContext);
 
  return (
    <Drawer
        anchor={SIDE_BAR_ORIENTATION}
        open={sideBarIsOpen}
        onClose={() => toogleSideBar()}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toogleSideBar()}
          onKeyDown={() => toogleSideBar()}
        >
          <List>
            {
              SIDE_BAR_ITEMS.map(({ label, path, icon: Icon }, index) => (
                <ListItem 
                  button
                  key={label}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <Link 
                    to={path}
                    style={{ textDecoration: 'auto', color: 'inherit' }}>
                    <ListItemText 
                      primary={label} />
                  </Link>
                </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
  )
}

export default SideBar;