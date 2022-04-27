import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
  Link
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { createEvents } from 'ics';
import moment from 'moment';

const FORMAT = 'YYYY-MM-DD-HH-mm';
const START_DATE = moment('2022-04-12').format('YYYY-MM-DD');
const END_DATE = moment('2022-09-19');

export default (props) => {
  const {
    numHorario,
    horario: {
      materias: schedule = []
    }
  } = props;

  const [link, setLink] = useState();
  const [isLoading, setIsLoading] = useState(false);


  const parseDate = (date) => date.format(FORMAT).split('-').map(Number);

  const parseSchedule = () => {
    const allEvents = schedule.reduce((acc, materia) => {
      const { nombre, profesor, codigo, paralelo } = materia;
      const { clases, examenes } = materia.eventos;
      const matEvents = [];
      clases.forEach((clase) => {
        const duration = moment(clase.fin).diff(clase.inicio, 'minutes');
        const startTime = moment(clase.inicio).format('HH-mm');
        let currentDate = moment(`${START_DATE} ${startTime}`);
        while(currentDate.isBefore(END_DATE)) {
          matEvents.push({
            title: `${nombre} ${paralelo}`,
            description: `${codigo} - ${profesor}`,
            start: parseDate(currentDate),
            duration: {
              minutes: duration
            }
          });
          currentDate = currentDate.add(1, 'week');
        }
      });
      if (examenes.parcial) {
        matEvents.push({
          title: `Examen Parcial ${nombre}`,
          description: `${codigo} - ${profesor}`,
          start: parseDate(moment(examenes.parcial.inicio)),
          duration: {
            minutes: moment(examenes.parcial.fin).diff(examenes.parcial.inicio, 'minutes')
          }
        });
      }
      if (examenes.final) {
        matEvents.push({
          title: `Examen Final ${nombre}`,
          description: `${codigo} - ${profesor}`,
          start: parseDate(moment(examenes.final.inicio)),
          duration: {
            minutes: moment(examenes.final.fin).diff(examenes.final.inicio, 'minutes')
          }
        });
      }
      if (examenes.mejoramiento) {
        matEvents.push({
          title: `Examen Mejoramiento ${nombre}`,
          description: `${codigo} - ${profesor}`,
          start: parseDate(moment(examenes.mejoramiento.inicio)),
          duration: {
            minutes: moment(examenes.mejoramiento.fin).diff(examenes.mejoramiento.inicio, 'minutes')
          }
        });
      }
      return [...acc, ...matEvents];
    }, []);
    return allEvents;
  }
  const createICSFile = () => {
    setIsLoading(true);
    const events = parseSchedule();
    createEvents(events, (error, calendar) => {
      if (error) {
        console.log('ERROR CREATING ICS FILE: ', error);
        return;
      }
      const filename = `Horario ${numHorario}.ics`; 
      const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
      setIsLoading(false);
      setLink({
        download: filename,
        href: window.URL.createObjectURL(blob)
      });
    });
  }
  return schedule ? (
    <Box sx={{
      padding: '10px',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      display: 'flex'
    }}>
      <TableContainer
        id='schedule-table'
        sx={{ maxWidth: 650 }}
        component={Paper}
        elevation={5}
      >
        <Table
          sx={{
            minWidth: 175
          }}
          size='small'
          aria-label='a dense table'
        >
          <TableHead>
            <TableRow>
              <TableCell>{'Code'}</TableCell>
              <TableCell align='left'>{'Name'}</TableCell>
              <TableCell align='left'>{'Course'}</TableCell>
              <TableCell align='left'>{'Teacher'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((row) => (
              <TableRow key={row['_id']}>
                <TableCell component='th' scope='row'>
                  {row.codigo}
                </TableCell>
                <TableCell align='left'>
                  {row.nombre}
                </TableCell>
                <TableCell align='left'>
                  {row.paralelo}
                </TableCell>
                <TableCell align='left'>
                  {row.profesor}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link
        sx={{ marginTop: '12px' }}
        href={link?.href}
        download={link?.download}
      >
        <LoadingButton
          onClick={createICSFile}
          loading={isLoading}
          variant='contained'
        >
          {'Download ICS File'}
        </LoadingButton>
      </Link>
    </Box>
  ) : (
    <Box sx={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      display: 'flex'
    }}>
      <Skeleton variant='rect' amination='wave' width={400} height={400} />
      <br />
      <Skeleton variant='circle' amination='wave' width={40} height={40} />
    </Box>
  );
};