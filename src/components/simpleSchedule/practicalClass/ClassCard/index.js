import React, { useState, useContext } from 'react';

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
import PracticalDialog from './Dialogs/PracticalDialog';
import FeedbackDialog from './Dialogs/FeedbackDialog';
import StepsContext from '../../Context';
import utils from '../../../../utils';
import { getChip } from './Chip';

const {
  functions: {
    formatters
  }
} = utils;

const ClassCard = (props) => {
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
    teorico_id: theoryClassId,
    lastParaleloProfesorJoined: lastStudentFeedback = {}
  } = paralelo || {};
  const [practicalClassesDisplayed, setPracticalClassesDisplayed] = useState(false);
  const [feedbackIsOpen, setFeedback] = useState(false);
  const {
    selectedValues: stepSelectedValues = {}
  } = step || {};
  const isAdded = theoryClassId
    ? stepSelectedValues[classCode]?.[theoryClassId]?.[classId]
    : stepSelectedValues[classCode]?.[classId];

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
      label: false,
      icon: <AddBoxOutlinedIcon />,
      tooltipNode: 'Añadir teórico'
    },
    {
      color: 'secondary',
      label: true,
      icon: <DeleteOutlinedIcon />,
      tooltipNode: 'Remover teórico'
    }
  ];


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
          )
        }
      }
      variant="outlined">
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundColor: top
                ? '#D4AF37'
                :'gray'
            }}>
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
                  in={Boolean(isAdded) == fab.label}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tooltip
                    title={fab.tooltipNode}
                    placement="bottom">
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: '0',
                        top: '0'
                      }}
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
            {
              lastStudentFeedback.promedio != undefined &&
              getChip(lastStudentFeedback.promedio, top)
            }
            {
              Object.keys(profesorDetail?.stats || {}).length > 0 && (
                <>
                  <Button
                    onClick={() => setFeedback(true)}
                    size="small"
                    variant="text"
                    color="primary"
                    endIcon={<ExpandMoreOutlinedIcon />}
                  >
                    Check feedback
                  </Button>
                  {
                    feedbackIsOpen &&
                    <FeedbackDialog
                    id="stats-profesor"
                    open={feedbackIsOpen}
                    keepMounted
                    onClose={() => setFeedback(!feedbackIsOpen) }
                    data={profesorDetail.stats}
                    profesor={profesorName}
                  />
                  }
                  
                </>
              )
            }
          </>
        }
      />
      <Divider />
      <CardContent sx={{
        padding: '16px',
        alignContent: 'left',
        alignItems: 'left'
      }}>
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
                      `${formatters.intervalExam(paralelo.eventos.examenes.parcial['inicio'], 
                      paralelo.eventos.examenes.parcial['fin'])}`
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
                      `${formatters.intervalExam(paralelo.eventos.examenes.final['inicio'], 
                      paralelo.eventos.examenes.final['fin'])}`
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
                      `${formatters.intervalExam(paralelo.eventos.examenes.mejoramiento['inicio'],
                       paralelo.eventos.examenes.mejoramiento['fin'])}`
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
              practicalClassesDisplayed &&
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

export default ClassCard;