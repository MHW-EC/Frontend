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
  Link,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import ical from 'ical-generator';
import moment from 'moment';

const UTC = moment().format('Z');
const END_DATE = moment('2022-09-19');
const START_DATE = moment('2022-04-12').format('YYYY-MM-DD');

const ClassTable = (props) => {
  const {
    scheduleInfo: {
      materias: schedule = []
    }
  } = props;
  const [link, setLink] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const parseSchedule = () => {
    const calendar = ical();
    schedule.forEach((materia) => {
      const { nombre, profesor, codigo, paralelo } = materia;
      const { clases, examenes } = materia.eventos;
      const exclude = [];
      if (examenes?.parcial) {
        const dateExam = moment(examenes.parcial.inicio).utcOffset(UTC);
        calendar.createEvent({
          description: `${profesor} - ${codigo}`,
          summary: `Examen Parcial ${paralelo}`,
          start: dateExam,
          end: moment(examenes.parcial.fin).utcOffset(UTC),
        });
        exclude.push(dateExam.format('YYYY-MM-DD'));
      }
      if (examenes?.final) {
        const dateExam = moment(examenes.final.inicio).utcOffset(UTC);
        calendar.createEvent({
          description: `${profesor} - ${codigo}`,
          summary: `Examen Final ${paralelo}`,
          start: dateExam,
          end: moment(examenes.final.fin).utcOffset(UTC),
        });
        exclude.push(dateExam.format('YYYY-MM-DD'));
      }
      if (examenes?.mejoramiento) {
        const dateExam = moment(examenes.mejoramiento.inicio).utcOffset(UTC);
        calendar.createEvent({
          description: `${profesor} - ${codigo}`,
          summary: `Examen Mejoramiento ${paralelo}`,
          start: dateExam,
          end: moment(examenes.mejoramiento.fin).utcOffset(UTC),
        });
        exclude.push(dateExam.format('YYYY-MM-DD'));
      }
      clases.forEach((clase) => {
        const statTime = moment(clase.inicio).format('HH:mm');
        const startDate = moment(`${START_DATE} ${statTime}`).utcOffset(UTC);
        const endTime = moment(clase.fin).format('HH:mm');
        const endDate = moment(`${START_DATE} ${endTime}`).utcOffset(UTC);
        calendar.createEvent({
          start: startDate,
          end: endDate,
          description: `${profesor} - ${codigo}`,
          summary: `${nombre} ${paralelo}`,
          repeating: {
            freq: 'WEEKLY',
            until: END_DATE,
            exclude: exclude.length ? exclude : undefined,
          },
        });
      });
    });
    return calendar;
  };
  const createICSFile = () => {
    setIsLoading(true);
    const calendar = parseSchedule().toString();
    const filename = `Horario ${numHorario}.ics`;
    const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
    setIsLoading(false);
    setLink({
      download: filename,
      href: window.URL.createObjectURL(blob),
    });
  };
  return schedule ? (
    <Box sx={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      display: 'flex'
    }}>
      <TableContainer
        id="schedule-table"
        sx={{ maxWidth: 650 }}
        component={Paper}
        elevation={5}
      >
        <Table
          sx={{
            minWidth: 175,
          }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>{'CODE'}</TableCell>
              <TableCell align='left'>{'NAME'}</TableCell>
              <TableCell align='left'>{'COURSE'}</TableCell>
              <TableCell align='left'>{'TEACHER'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((row) => (
              <TableRow key={row['_id']}>
                <TableCell component="th" scope="row">
                  {row.codigo}
                </TableCell>
                <TableCell align="left">{row.nombre}</TableCell>
                <TableCell align="left">{row.paralelo}</TableCell>
                <TableCell align="left">{row.profesor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link
        sx={{ marginTop: '12px', textDecoration: 'none' }}
        href={link?.href}
        download={link?.download}
      >
        <LoadingButton
          onClick={createICSFile}
          loading={isLoading}
          variant="contained"
        >
          {'Download ICS File'}
        </LoadingButton>
      </Link>
    </Box>
  ) : (
    <Box
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        display: 'flex',
      }}
    >
      <Skeleton variant="rect" amination="wave" width={400} height={400} />
      <br />
      <Skeleton variant="circle" amination="wave" width={40} height={40} />
    </Box>
  );
};

export default ClassTable;
