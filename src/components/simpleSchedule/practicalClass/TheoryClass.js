import React, { useState, useEffect } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  CardHeader,
  Button,
  Divider,
  Zoom,
  Skeleton,
  Box,
  Paper
} from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
// import DialogPractico from './dialog-practico';
// import DialogStats from './dialog-stats';
import utils from '../../../utils';

// import {
//   addSeleccionado,
//   removeSeleccionado,
// } from '../../../redux/actions/seleccionados';
// import { addPaquete, removePaquete } from '../../../redux/actions/paquetes';
// import { profesorSelector } from '../../../redux/selectors';
// import { getProfesor } from '../../../redux/actions/profesor';
// import { seleccionados as selSelector } from '../../../redux/selectors';
// import { GetChip } from './ClassChip';

import { BOUNDARIES } from '../../../utils/constants';

const {
  functions: {
    formatters
  }
} = utils;


const countByTeorico = (teoricosIdArray, materiaCode) => {
  return teoricosIdArray.reduce(
    (amount, element) => amount + (element.split('_')[0] === materiaCode),
    0
  );
};
const classes = {
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  div: {
    padding: "16px",
    alignContent: 'left',
    alignItems: 'left',
  },
  fab: {
    position: 'absolute',
    right: '0',
    top: '0',
  },
  ghostIcon: {
    opacity: 0,
    padding: 10,
  },
  avatar: {
    backgroundColor: 'gray',
  },
  root: {
    height: 'auto',
    marginRight: '16px'
  },
  rootTop: {
    borderColor: '#D4AF37',
    marginRight: '16px'
  },
  avatarTop: {
    backgroundColor: '#D4AF37',
  },
}

export default function SimpleCard(props) {
  // const classes = useStyles();
  const {
    paralelo,
    top
  } = props || {};
  const {
    profesor: profesorName = "",
    profesorJoined: profesorDetail = {},
    // lastParaleloProfesorJoined: lastStudentFeedback
  } = paralelo || {};
  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [cargado, setCargado] = useState(true);
  const [isAdded, setAdded] = useState("Add"); //necesariamente numerico y no bool
  const seleccionados = [];
  console.log("----", paralelo);

  const handleAddRemove = () => {
    if (isAdded == 'Add') {
      // let materiaCode = paralelo['_id'].split('_')[0];
      // let amount = countByTeorico(seleccionados, materiaCode);
      // if (amount >= BOUNDARIES.COURSES.THEORY_CLASS.MAX) {
      //   console.log("max reached");
      //   return;
      // }
      // dispatch(addSeleccionado(paralelo['_id']));
      setAdded("Remove");
    } else if (isAdded == 'Remove') {
      // dispatch(removeSeleccionado(paralelo['_id']));
      setAdded("Add");
    }
    // if (paralelo['paralelos_practicos'].length === 0) {
    //   isAdded
    //     ? dispatch(addPaquete([paralelo], paralelo['_id']))
    //     : dispatch(removePaquete(paralelo['_id']));
    // }
  };

  const fabs = [
    {
      color: 'primary',
      sx: classes.fab,
      icon: <AddBoxOutlinedIcon />,
      label: 'Add',
      tooltipNode: 'Añadir teórico',
    },
    {
      color: 'secondary',
      sx: classes.fab,
      icon: <DeleteOutlinedIcon />,
      label: 'Remove',
      tooltipNode: 'Remover teórico',
    },
  ];

  const handleParAsociados = () => {
    setOpen(true);
    setCargado(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleStats = () => {
    setOpenStats(true);
  };

  const handleCloseDialogStats = () => {
    setOpenStats(false);
  };
  return paralelo ? (
    <Card
      sx={
        {
          "display": "inline-block",
          "height": "inherit",
          ...(top
            ? classes.rootTop
            : classes.root)
        }
      }
      variant="outlined">
      <CardHeader
        avatar={
          <Avatar
            sx={
              top ? classes.avatarTop : classes.avatar
            }>
            {
              paralelo['paralelo']
            }
          </Avatar>
        }
        action={
          paralelo &&
          <Box sx={{
            display: 'flex',
            position: 'relative',
            width: "60px"
          }}>
            {
              fabs.map((fab) => (
                <Zoom
                  key={fab.color}
                  appear={false}
                  in={isAdded === fab.label}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tooltip
                    title={fab.tooltipNode}
                    placement="bottom">
                    <IconButton
                      sx={fab.sx}
                      color={fab.color}
                      onClick={handleAddRemove}
                    >
                      {fab.icon}
                    </IconButton>
                  </Tooltip>
                </Zoom>
              ))
            }
          </Box>
        }
        title={profesorName || 'SIN NOMBRE'}
        subheader={
          <>
            {/* {GetChip(lastStudentFeedback.promedio, top)} */}
            {
              profesorDetail.stats && (
                <>
                  <Button
                    onClick={handleStats}
                    size="small"
                    variant="text"
                    color="primary"
                    endIcon={<ExpandMoreOutlinedIcon />}
                  >
                    Check feedback
                  </Button>
                  {/* <DialogStats
                    id="stats-profesor"
                    open={openStats}
                    keepMounted
                    onClose={handleCloseDialogStats}
                    data={profesor.stats}
                    profesor={paralelo['profesor']}
                  /> */}
                </>
              )
            }
          </>
        }
      // style={{ padding: 12 }}
      />
      <Divider />
      <CardContent sx={classes.div}>
        <Typography variant="body2" component="p" aling="left">
          Clases
        </Typography>
        {
          paralelo?.eventos?.clases.map(({ inicio, fin }) => (
            <React.Fragment
              key={`${inicio}-${fin}`}
            >
              <Typography
                variant="body2"
                align="right"
                color="textSecondary">
                {
                  `${formatters.interval(inicio, fin)}`
                }
              </Typography>
            </React.Fragment>
          ))
        }
        {
          paralelo?.eventos && (
            <React.Fragment>
              <Typography
                variant="body2"
                component="p">
                Examenes
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                <Typography
                  variant="body2"
                  component="div"
                  color="textSecondary">
                  {
                    'Parcial '
                  }
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  color="textSecondary">
                  {
                    `${formatters.intervalExam(paralelo.eventos.examenes.parcial['inicio'], paralelo.eventos.examenes.parcial['fin'])}`
                  }
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                <Typography
                  variant="body2"
                  component="div"
                  color="textSecondary">
                  {
                    'Final '
                  }
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  color="textSecondary">
                  {
                    `${formatters.intervalExam(paralelo.eventos.examenes.final['inicio'], paralelo.eventos.examenes.final['fin'])}`
                  }
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                <Typography
                  variant="body2"
                  component="div"
                  color="textSecondary">
                  {
                    'Mejoramiento '
                  }
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  color="textSecondary">
                  {
                    `${formatters.intervalExam(paralelo.eventos.examenes.mejoramiento['inicio'], paralelo.eventos.examenes.mejoramiento['fin'])}`
                  }
                </Typography>
              </Box>
            </React.Fragment>
          )}
      </CardContent>
      {
        paralelo &&
        paralelo.paralelos_practicos?.length > 0 &&
        <>
          <Divider />
          <CardActions>
            <Button
              size="small"
              onClick={handleParAsociados}
              color="primary"
              startIcon={<AddCircleOutlineOutlinedIcon />}
            >
              {"Practical classes"}
            </Button>
            {/* <DialogPractico
              id="práctico-menu"
              open={open}
              cargado={cargado}
              keepMounted
              onClose={handleCloseDialog}
              teoricoid={paralelo['_id']}
              teorico={paralelo}
            /> */}
          </CardActions>
        </>
      }
    </Card>
  ) : (
    <Card
      variant="outlined">
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circle"
            width={40}
            height={40} />
        }
        title={
          <div
            style={{
              width: '80%',
              marginLeft: 'auto',
              marginRight: 'auto'
            }
            }>
            <Skeleton
              animation="wave"
              variant="text"
              height={10} />
          </div>
        }
        subheader={
          <div
            style={{
              width: '50%',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
            <Skeleton
              animation="wave"
              variant="text"
              height={10} />
          </div>
        }
      />
      <CardContent
        style={{
          padding: 0
        }}>
        <Skeleton
          animation="wave"
          variant="rect"
          height={150} />
      </CardContent>
      <CardActions>
        <Skeleton
          animation="wave"
          variant="rect"
          height={25}
          width={80}
          style={{ borderRadius: 4 }}
        />
      </CardActions>
    </Card>
  );
}
