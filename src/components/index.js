
import React from "react";
import MainContext from './Context';
import Header from './header';
import SideBar from './sideBar';
import Home from './home';
import SimpleSchedule from './simpleSchedule';
import LinearProgress from '@mui/material/LinearProgress';
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
        color: 'secondary',
        value: 0,
        variant: 'indeterminate'
      }
    }
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

  componentDidMount() { }

  componentDidUpdate(_, prevState) { }

  render() {
    console.log("App render");

    const {
      sideBarIsOpen,
      lightMode,
      process: {
        isLoading,
        progress
      }
    } = this.state;

    const {
      toogleSideBar,
      toogleLightMode
    } = this;

    return (
      <MainContext.Provider
        value={{
          sideBarIsOpen,
          toogleSideBar,
          lightMode,
          toogleLightMode
        }}>
        <Router>
          {
            isLoading && 
            <LinearProgress
            variant={progress.variant}
            value={progress.value}
            color={progress.color}/>
          }
          <SideBar />
          <Header />
          <Switch>
            {
              ROUTES.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  children={<route.component />}
                />
              ))
            }
          </Switch>
        </Router>
      </MainContext.Provider>
    )
  }
}
export default App;