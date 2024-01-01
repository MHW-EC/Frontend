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

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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
                minHeight: '100%',
                display: 'initial',
                transform: 'translateZ(0px)',
                flexGrow: 1,
              }}
            >
              <amp-ad
                width="100vw"
                height="320"
                type="adsense"
                data-ad-client="ca-pub-6316061427279046"
                data-ad-slot="6079638243"
                data-auto-format="rspv"
                data-full-width=""
              >
                <div overflow=""></div>
              </amp-ad>

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
              <amp-ad
                width="100vw"
                height="320"
                type="adsense"
                data-ad-client="ca-pub-6316061427279046"
                data-ad-slot="5121779799"
                data-auto-format="rspv"
                data-full-width=""
              >
                <div overflow=""></div>
              </amp-ad>
            </Paper>
          </SnackbarProvider>
        </ThemeProvider>
      </MainContext.Provider>
    );
  }
}

const withTheme = (Component) => (props) => {
  const matches = useMediaQuery('(prefers-color-scheme: dark)');
  return <Component {...props} useDark={matches} />;
};

export default withTheme(App);
