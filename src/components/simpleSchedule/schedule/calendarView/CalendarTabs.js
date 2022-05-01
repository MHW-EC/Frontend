import React, { useState, useEffect, useCallback } from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box
} from '@mui/material';
import * as Colors from '@mui/material/colors';
import Utils from '../../../../utils/functions';
import Calendar from './Calendar';


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {
        value === index &&
        <Box p={1}>
          {children}
        </Box>
      }
    </Typography>
  );
}

const tabProps = (index) => {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

const LinkTab = (props) => {
  return (
    <Tab
      component='a'
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export default (props) => {
  const {
    scheduleInfo: {
      materias: schedule = []
    } = {}
  } = props;
  const [currentTabIdx, setTabIdx] = useState(0);
  const [eventInstances, setEventInstances] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (schedule) setEventInstances(getInstances(schedule));
    if (schedule) setEvents(getAppointments(schedule));
  }, []);

  const getInstances = useCallback((schedule) => {
    const codigosUnicos = schedule.map(
      e => e.codigo).filter(
        (e, i, a) => a.indexOf(e) === i);
    return codigosUnicos.map((element, idx) => {
      return {
        id: element,
        color: Object.values(Colors).slice(1)[idx]
      }
    });
  }, []);

  const getAppointments = useCallback((schedule) => {
    const appointments = [[], [], [], []]

    schedule.forEach((_class) => {
      const {
        eventos: {
          clases: classEvents = [],
          examenes: examEvents = {}
        } = {}
      } = _class;
      const {
        parcial: firstExamn = {},
        final: secondExamn = {},
        mejoramiento: thirdExamn = {}
      } = examEvents || {};

      classEvents.forEach((clase) => {
        appointments[0].push(
          Utils.parsers.eventToAppointment(_class, clase, appointments[0].length, true)
        );
      });
      if (Object.keys(examEvents).length === 3) {
        appointments[1].push(
          Utils.parsers.eventToAppointment(_class, firstExamn, appointments[1].length, false)
        );
        appointments[2].push(
          Utils.parsers.eventToAppointment(_class, secondExamn, appointments[2].length, false)
        );
        appointments[3].push(
          Utils.parsers.eventToAppointment(_class, thirdExamn, appointments[3].length, false)
        );
      }
    });
    return appointments;
  });

  return eventInstances.length && events.length && (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: theme => theme.palette.background.paper,
      }}
      id='root-views'>
      <AppBar position='static' color='inherit'>
        <Tabs
          variant='fullWidth'
          value={currentTabIdx}
          onChange={(_, newValue) => setTabIdx(newValue)}
          aria-label='schedule tabs'>
          <LinkTab
            label='CLASES'
            {...tabProps(0)}
          />
          <LinkTab
            label='PARCIAL'
            {...tabProps(1)}
          />
          <LinkTab
            label='FINAL'
            {...tabProps(2)}
          />
          <LinkTab
            label='MEJORAMIENTO'
            {...tabProps(3)}
          />
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis={'x-reverse'}
        index={currentTabIdx}
        onChangeIndex={(index) => setTabIdx(index)}
      >
        <TabPanel value={currentTabIdx} index={0}>
          <Calendar appointments={events[0]} instances={eventInstances} />
        </TabPanel>

        <TabPanel value={currentTabIdx} index={1}>
          <Calendar appointments={events[1]} instances={eventInstances} />
        </TabPanel>

        <TabPanel value={currentTabIdx} index={2}>
          <Calendar appointments={events[2]} instances={eventInstances} />
        </TabPanel>

        <TabPanel value={currentTabIdx} index={3}>
          <Calendar appointments={events[3]} instances={eventInstances} />
        </TabPanel>
      </SwipeableViews>

    </Box>
  );
}
