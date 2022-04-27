
import React from "react";
import MainContext from './Context';
import Options from './options';
import Home from './home';
import SimpleSchedule from './simpleSchedule';
import { ThemeProvider } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Themes from './../themes';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const ROUTES = [
  {
    path: "/",
    exact: true,
    component: () => <Home />
  },
  {
    path: "/simple-schedule",
    component: () => <SimpleSchedule />
  },
  // {
  //   path: "/",
  //   component: () => <div>multiplayer!</div>
  // }
];

class App extends React.Component {
  state = {
    sideBarIsOpen: false,
    theme: 'dark',
    process: {
      isLoading: false,
      error: undefined,
      progress: {
        color: 'primary',
        value: 0,
        variant: 'indeterminate'
      }
    }
  }

  setProcess = (newProcesState) => {
    const {
      state: { process }
    } = this;
    this.setState({
      process: {
        ...process,
        ...newProcesState,
        progress: {
          ...process.progress,
          ...(newProcesState.progress || {}),
        }
      }
    });
  }

  toogleSideBar = () => {
    this.setState({
      sideBarIsOpen: !this.state.sideBarIsOpen
    })
  }

  setTheme = (theme) => {
    this.setState({
      theme
    })
  }

  componentDidMount() { }

  componentDidUpdate(_, prevState) { }

  render() {
    const {
      sideBarIsOpen,
      lightMode,
      process,
      theme
    } = this.state;

    const {
      toogleSideBar,
      setTheme,
      setProcess
    } = this;

    const {
      isLoading,
      progress
    } = process

    return (
      <MainContext.Provider
        value={{
          sideBarIsOpen,
          toogleSideBar,
          lightMode,
          setTheme,
          setProcess,
          process,
          theme
        }}>
        <ThemeProvider theme={Themes[theme]}>
          <Paper
            square
            sx={{
              minHeight: '100%',
              display: "initial",
              transform: 'translateZ(0px)',
              flexGrow: 1,
            }}>
            <Router>
              {
                isLoading &&
                <LinearProgress
                  sx={{
                    height: "4px",
                    zIndex: "999",
                    position: "fixed",
                    width: "100%"
                  }}
                  variant={progress.variant}
                  value={progress.value}
                  color={progress.color} />
              }
              <Switch>
                {
                  ROUTES.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                    >
                      <route.component />
                    </Route>
                  ))
                }
              </Switch>
              <Options />
            </Router>
          </Paper>
        </ThemeProvider>
      </MainContext.Provider>
    )
  }
}
export default App;