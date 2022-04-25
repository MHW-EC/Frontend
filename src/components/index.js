
import React from "react";
import MainContext from './Context';
import Options from './options';
import Home from './home';
import SimpleSchedule from './simpleSchedule';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
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
    lightMode: true,
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

  toogleLightMode = () => {
    this.setState({
      lightMode: !this.state.lightMode
    })
  }

  componentDidMount() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js');
    }
  }

  componentDidUpdate(_, prevState) { }

  render() {
    const {
      sideBarIsOpen,
      lightMode,
      process
    } = this.state;

    const {
      toogleSideBar,
      toogleLightMode,
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
          toogleLightMode,
          setProcess,
          process
        }}>
        <Box
          sx={{
            height: "100%",
            display: "initial",
            transform: 'translateZ(0px)',
            flexGrow: 1,
            }}>
          <Router>
            {
              isLoading &&
              <LinearProgress
                sx={{
                  position: "absolute",
                  width: '100%'
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
        </Box>
      </MainContext.Provider>
    )
  }
}
export default App;