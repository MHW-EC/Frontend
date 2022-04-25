import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box
} from '@mui/material';

export default (props) => {
  const {
    horario: {
      materias: schedule
    }
  } = props;

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
        sx={{
          maxWidth: 650
        }}
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
              <TableCell align='left'>{'Profesor'}</TableCell>
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