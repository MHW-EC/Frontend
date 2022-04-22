import React, { useState,useContext } from 'react';

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
  Box
} from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PracticalDialog from './PracticalDialog';
// import DialogStats from './dialog-stats';
import StepsContext from './../Context';

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
    transform: 'scale(0.8)'
  },
  div: {
    padding: '16px',
    alignContent: 'left',
    alignItems: 'left'
  },
  fab: {
    position: 'absolute',
    right: '0',
    top: '0'
  },
  ghostIcon: {
    opacity: 0,
    padding: 10
  },
  avatar: {
    backgroundColor: 'gray'
  },
  avatarTop: {
    backgroundColor: '#D4AF37'
  }
};

export default (props) => {
  const {
    paralelo,
    top,
    stepId,
    parentComponent
  } = props || {};
  const { steps, updateStep } = useContext(StepsContext);
  const step = steps[Number(stepId)];

  const {
    _id: classId,
    profesor: profesorName = '',
    profesorJoined: profesorDetail = {},
    codigo: classCode,
    paralelo: classNumber,
    teorico_id: theoryClassId
    // lastParaleloProfesorJoined: lastStudentFeedback
  } = paralelo || {};
  const [practicalClassesDisplayed, setPracticalClassesDisplayed] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const {
    selectedValues: stepSelectedValues = {}
    // data: stepData,
    // description: stepDescription
  } = step || {};
  const isAdded = 
    stepSelectedValues[classCode]?.[theoryClassId]?.[classId] || 
    stepSelectedValues[classCode]?.[classId];

  const handleAddRemove = () => {
    if (!stepSelectedValues[classCode]) stepSelectedValues[classCode] = {};
    if (theoryClassId) {
      stepSelectedValues[classCode][theoryClassId] = {
        ...stepSelectedValues[classCode]?.[theoryClassId],
        [classId]: !stepSelectedValues[classCode]?.[theoryClassId]?.[classId]
      };
    } else {
      stepSelectedValues[classCode][classId] = !stepSelectedValues[classCode]?.[classId];
    }
    updateStep(
      stepId, 
      {
        selectedValues: stepSelectedValues
      },
      'selectedValues'
    ); 
  };

  const fabs = [
    {
      color: 'primary',
      sx: classes.fab,
      label: false,
      icon: <AddBoxOutlinedIcon />,
      tooltipNode: 'Añadir teórico'
    },
    {
      color: 'secondary',
      sx: classes.fab,
      label: true,
      icon: <DeleteOutlinedIcon />,
      tooltipNode: 'Remover teórico'
    }
  ];

  const handleStats = () => {
    setOpenStats(true);
  };

  return paralelo ? (
    <Card
      sx={
        {
          display: parentComponent == 'PracticalForm' ? 'block' : 'inline-block',
          height: '-webkit-fill-available',
          width: parentComponent == 'PracticalForm' ? '100%' : 'unset',
          marginRight: parentComponent == 'PracticalForm' ? '100%' : '16px',
          ...(
            top 
              ? { borderColor: '#D4AF37' }
              : {}
          ) }
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
            width: '60px'
          }}>
            {
              fabs.map((fab, idx) => (
                <Zoom
                  key={String(idx)}
                  appear={false}
                  in={(isAdded != undefined) == fab.label}
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
      />
      <Divider />
      <CardContent sx={classes.div}>
        <Typography variant="body2" component="p" aling="left">
          Clases
        </Typography>
        {
          paralelo?.eventos?.clases.map(({ inicio, fin }, idx) => (
            <React.Fragment
              key={`${idx}`}
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
          paralelo?.eventos?.examenes && (
            <React.Fragment>
              <Typography
                variant="body2"
                component="p">
                Examenes
              </Typography>
              {
                paralelo.eventos.examenes.parcial &&
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
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
              }
              {
                paralelo.eventos.examenes.final &&
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
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
              }
              {
                paralelo.eventos.examenes.mejoramiento &&
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
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
              }
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
              onClick={() => setPracticalClassesDisplayed(true)}
              color="primary"
              startIcon={<AddCircleOutlineOutlinedIcon />}
            >
              {'Practical classes'}
            </Button>
            {
              <PracticalDialog
                id="practicalMenu"
                open={practicalClassesDisplayed}
                keepMounted
                onClose={() => setPracticalClassesDisplayed(false)}
                teoricoid={paralelo['_id']}
                teorico={paralelo}
                stepId={stepId}
              />
            }
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
};
