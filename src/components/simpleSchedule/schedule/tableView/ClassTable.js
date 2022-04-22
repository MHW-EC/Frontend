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

const classes = {
	table: {
		minWidth: 175,
	},
	tableContainer: {
		maxWidth: 650,
	},
	root: {
		padding: '10px',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		display: 'flex',
	},
	skeleton: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		display: 'flex',
	}
};

export default (props) => {
  const {
    horario: schedule
  } = props;

	return schedule ? (
		<Box sx={classes.root}>
			<TableContainer
				id='schedule-table'
				sx={classes.tableContainer}
				component={Paper}
				elevation={5}
			>
				<Table
					sx={classes.table}
					size='small'
					aria-label='a dense table'
				>
					<TableHead>
						<TableRow>
							<TableCell>{"Code"}</TableCell>
							<TableCell align='left'>{"Name"}</TableCell>
							<TableCell align='left'>{"Course"}</TableCell>
							<TableCell align='left'>{"Profesor"}</TableCell>
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
		<Box sx={classes.skeleton}>
			<Skeleton variant='rect' amination='wave' width={400} height={400} />
			<br />
			<Skeleton variant='circle' amination='wave' width={40} height={40} />
		</Box>
	);
}