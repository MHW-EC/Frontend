
import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box
} from '@mui/material';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  Resources,
  DayView,
} from '@devexpress/dx-react-scheduler-material-ui';
import * as Colors from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

const getNumberHour = (date, delta) => {
  // 13:30 -> 13.5, 13:10 -> 13, 13:45-> 14
  const fraccion = delta / 60;
  const hora = date.getHours();
  const horaFraccion = Math.ceil(date.getMinutes() / delta) * fraccion;
  return hora + horaFraccion;
};
const getLimitesVerticales = (delta, appointments) => {
  let inicio = appointments[0]['startDate'];
  let inicioNumber = getNumberHour(inicio, delta);
  let fin = appointments[0]['endDate'];
  let finNumber = getNumberHour(fin, delta);

  appointments.forEach((element) => {
    inicioNumber =
      getNumberHour(element['startDate'], delta) < inicioNumber
        ? getNumberHour(element['startDate'], delta)
        : inicioNumber;
    finNumber =
      getNumberHour(element['endDate'], delta) > finNumber
        ? getNumberHour(element['endDate'], delta)
        : finNumber;
  });
  return {
    inicio: inicioNumber,
    fin: finNumber,
  };
};
const getExcludedDays = (appointments) => {
  let todos = [0, 6];
  appointments.forEach((element) => {
    let indice = todos.findIndex(
      (f) => f === element['startDate'].getDay()
    );
    if (indice !== -1) {
      todos.splice(indice, 1);
    }
  });
  return todos;
};
const setearColores = (appointments) => {
  appointments.forEach((element) => {
    element['members'] = [element['codigo']];
  });
  return appointments;
};

const AppointmentContent = ({data, formatDate, ...restProps }) => (
  <Appointments.AppointmentContent
    {...restProps}
    formatDate={formatDate}
    data={data}
  >
    <Box sx={{
      textAlign: 'center',
      display: 'inline-block',
      width: '100%',
    }}>
      <Box sx={{
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'pre-wrap',
      }}>{data.codigo}</Box>
      <Box sx={{
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'pre-wrap',
      }}>{data.nombre}</Box>
      <Box sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>PAR {data.paralelo}</Box>
      <Box sx={{
        lineHeight: 1,
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
      }}>
        <Box sx={{
          display: 'inline-block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {formatDate(data.startDate.toString(), {
            hour: 'numeric',
            minute: 'numeric',
          })}
        </Box>
        <Box sx={{
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }}>{' - '}</Box>
        <Box sx={{
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }}>
          {formatDate(data.endDate.toString(), {
            hour: 'numeric',
            minute: 'numeric',
          })}
        </Box>
      </Box>
    </Box>
  </Appointments.AppointmentContent>
);

const CELL_DURATION = 30;

export default (props) => {
  const {
    instances
  } = props;
  const width = useWidth();
  const [currentViewName, setCurrentViewName] = useState('Week');
  const [appointments, setAppointments] = useState(props.appointments);
  const [currentDate, setCurrentDate] = useState();
  
  const [hoursBoundaries, setHoursBoundaries] = useState();
  const [excludedDays, setExcludedDays] = useState();
  const [resources, setResources] = useState();
  const [firstDay, setFirstDay] = useState();

  useEffect(() => {
    if (currentDate) setFirstDay(new Date(currentDate).getDay());
  }, [currentDate]);

  useEffect(() => {
    if (instances) {
      setResources([
        {
          fieldName: 'members',
          allowMultiple: true,
          instances: instances,
        },
      ]);
    }
  }, [instances]);

  useEffect(() => {
    if (appointments) setCurrentDate(appointments[0]['startDate']);
    if (width === 'xs') setCurrentViewName('Day');
    if (width !== 'xs') setCurrentViewName('Week');
  }, [width]);

  useEffect(() => {
    if (appointments) {
      setCurrentDate(appointments[0]['startDate']);
      setHoursBoundaries(getLimitesVerticales(CELL_DURATION, appointments));
      setExcludedDays(getExcludedDays(appointments));
      setAppointments(setearColores(appointments));
    }
  }, [appointments]);

  return appointments &&
    resources &&
    currentDate &&
    excludedDays &&
    hoursBoundaries ? (
    <Paper>
      <Scheduler data={appointments} locale="es-ES" firstDayOfWeek={firstDay}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={
            (currentDate) => {
            const begins = new Date(appointments[0]['startDate']);
            const ends = new Date(appointments[appointments.length - 1]['startDate']);
            const current = new Date(currentDate);
            if (begins <= current && current <= ends) setCurrentDate(currentDate);
          }}
          currentViewName={currentViewName}
        />
        <WeekView
          excludedDays={excludedDays}
          cellDuration={CELL_DURATION}
          startDayHour={hoursBoundaries['inicio']}
          endDayHour={hoursBoundaries['fin']}
        />
        <DayView
          cellDuration={CELL_DURATION}
          startDayHour={hoursBoundaries['inicio']}
          endDayHour={hoursBoundaries['fin']}
        />
        <Toolbar />
        <DateNavigator />
        <Appointments appointmentContentComponent={AppointmentContent} />
        <Resources palette={[Colors.red]} data={resources} />
      </Scheduler>
    </Paper>
  ): <></>;
}
