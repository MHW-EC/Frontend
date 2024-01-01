import React from 'react';
import MainContext from './Context';
import Options from './options';
import Home from './home';
import SimpleSchedule from './simpleSchedule';
import { ThemeProvider } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import Themes from './../themes';
import { SnackbarProvider } from 'notistack';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';

const ROUTES = [
  {
    path: '/',
    exact: true,
    component: () => <Home />,
  },
  {
    path: '/simple-schedule',
    component: () => <SimpleSchedule />,
  },
  // {
  //   path: "/",
  //   component: () => <div>multiplayer!</div>
  // }
];

class App extends React.Component {
  state = {
    sideBarIsOpen: false,
    theme: this.props.useDark ? 'dark' : 'default',
    process: {
      isLoading: false,
      error: undefined,
      progress: {
        color: 'primary',
        value: 0,
        variant: 'indeterminate',
      },
    },
  };

  setProcess = (newProcesState) => {
    const {
      state: { process },
    } = this;
    this.setState({
      process: {
        ...process,
        ...newProcesState,
        progress: {
          ...process.progress,
          ...(newProcesState.progress || {}),
        },
      },
    });
  };

  toogleSideBar = () => {
    this.setState({
      sideBarIsOpen: !this.state.sideBarIsOpen,
    });
  };

  setTheme = (theme) => {
    this.setState({
      theme,
    });
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.useDark !== this.props.useDark) {
      this.setState({
        theme: this.props.useDark ? 'dark' : 'default',
      });
    }
  }

  render() {
    const { pathname } = this.props;
    const { sideBarIsOpen, lightMode, process, theme } = this.state;

    const { toogleSideBar, setTheme, setProcess } = this;

    const { isLoading, progress } = process;

    return (
      <MainContext.Provider
        value={{
          sideBarIsOpen,
          toogleSideBar,
          lightMode,
          setTheme,
          setProcess,
          process,
          theme,
        }}
      >
        <ThemeProvider theme={Themes[theme]}>
          <SnackbarProvider preventDuplicate maxSnack={3}>
            <Paper
              square
              sx={{
                minWidth: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {pathname === '/' && (
                <div align="center" className="cd-ads-google">
                  <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '728px', height: '90px' }}
                    data-ad-client="ca-pub-6316061427279046"
                    data-ad-slot="5121779799"
                  ></ins>
                </div>
              )}

              <Router>
                {isLoading && (
                  <LinearProgress
                    sx={{
                      height: '4px',
                      zIndex: '999',
                      position: 'fixed',
                      width: '100%',
                    }}
                    variant={progress.variant}
                    value={progress.value}
                    color={progress.color}
                  />
                )}
                <Switch>
                  {ROUTES.map((route, index) => (
                    <Route key={index} path={route.path} exact={route.exact}>
                      <route.component />
                    </Route>
                  ))}
                </Switch>
                <Options />
              </Router>
              <div align="center" className="cd-ads-google cd-ads-response">
                <ins
                  className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-6316061427279046"
                  data-ad-slot="6079638243"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>
              </div>
            </Paper>
          </SnackbarProvider>
        </ThemeProvider>
      </MainContext.Provider>
    );
  }
}

const withTheme = (Component) => (props) => {
  const matches = useMediaQuery('(prefers-color-scheme: dark)');
  //get current path with hook react
  const { pathname } = useLocation();
  return <Component {...props} useDark={matches} pathname={pathname} />;
};

export default withTheme(App);
