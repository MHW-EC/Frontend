
import React, { useContext } from 'react';
import MainContext from './../Context';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeIcon from '@mui/icons-material/LightMode';

const Header = () => {
  console.log("Header render");
  const {
    toogleSideBar,
    lightMode,
    toogleLightMode
  } = useContext(MainContext);

  // const [isThemeLight, setTheme] = useState(true);
  // const [initTheme, setInitTheme] = useState(false);

  // const themeButtonHandler = () => {
  //   setTheme(!isThemeLight);
  // };

  // useEffect(() => {
  //   if (!initTheme) {
  //     if (
  //       window.matchMedia &&
  //       window.matchMedia('(prefers-color-scheme: dark)').matches
  //     ) {
  //       setTheme(false);
  //     }
  //     window
  //       .matchMedia('(prefers-color-scheme: dark)')
  //       .addEventListener('change', (e) => {
  //         if (e.matches) {
  //           setTheme(false);
  //         } else {
  //           setTheme(true);
  //         }
  //       });
  //     setInitTheme(true);
  //   }
  // }, [isThemeLight, initTheme]);
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => toogleSideBar()}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">MHW</Typography>
        <div>
          <IconButton
            color="inherit"
            onClick={toogleLightMode}
          >
            {
              lightMode 
              ? <LightModeIcon />
              : <NightlightRoundIcon />
            }
          </IconButton>

        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header;