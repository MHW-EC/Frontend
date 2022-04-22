import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import {
  Pagination,
  Backdrop,
  CircularProgress
} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import ClassTable from './ClassTable';
import StepsContext from './../../Context';
import MainContext from './../../../Context';
import { generate } from './../../../../services';
// import ButtonDialog from './full-dialog';

const classes = {
  root: {
    '& > * + *': {
      marginTop: theme => theme.spacing(2),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      display: 'flex'
    }
  },
  backdrop: {
    zIndex: theme => theme.zIndex.drawer + 1,
    color: '#fff'
  }
};

const TableView = (props) => {
  
  const { stepId, lastStepId } = props;
  const { steps, updateStep } = useContext(StepsContext);
  const [open, setOpen] = useState(false);
  const step = steps[Number(stepId)];
  const {
    // selectedValues: stepSelectedValues,
    data: stepData
    // description: stepDescription
  } = step;

  const lastStep = steps[Number(lastStepId)];
  const {
    data: lastStepData = {},
    selectedValues: lastStepSelectedValues = {}
  } = lastStep;
  const { process, setProcess } = useContext(MainContext);
  const {
    isLoading
  } = process;
  const [currentTableIndex, setCurrentTable] = useState(1);
  const requestControler = useMemo(() => new AbortController(), []);
  const preparePayload = useCallback((lastData = {}, lastSelected = {}) => {
    const requestBody = [];
    for (const classCode in lastSelected) {
      console.log('iter classCode: ', classCode);
      if (lastSelected[classCode] instanceof Object) {
        for (const theoryClassId in lastSelected[classCode]) {
          console.log('iter theoryClassId: ', theoryClassId);
          //empty array
          const classPackage = [];
          if (lastSelected[classCode][theoryClassId]) {
            const theoryClassObject = lastData[classCode].find(_class => _class._id == theoryClassId);
            console.log('iter theoryClassObject: ', theoryClassObject);
            if (theoryClassObject) classPackage.push(theoryClassObject);
            //extract theory class
            //append to empty array
          }
          if (lastSelected[classCode][theoryClassId] instanceof Object) {
            for (const practicalClassId in lastSelected[classCode][theoryClassId]) {
              console.log('iter practicalClassId: ', practicalClassId);
              if (lastSelected[classCode][theoryClassId][practicalClassId]) {
                const practicalClassObject = lastData[theoryClassId].find(_class => _class._id == practicalClassId);
                console.log('iter practicalClassObject: ', practicalClassObject);
                if (practicalClassObject) classPackage.push(practicalClassObject);
                //extract practical class
                //append to empty array
              }
            }
          }
          console.log('classPackage: ', classPackage);
          requestBody.push(classPackage);
          //append array to request
        }
      }
    }
    console.log('requestBody: ', requestBody);
    return requestBody;
  }, []);

  useEffect(() => {
    (async () => {
      if (!isLoading && !stepData) {
        try {
          setProcess({
            isLoading: true,
            progress: {
              variant: 'indeterminate'
            }
          });
          const scheduleId = await generate(
            { body: preparePayload(lastStepData, lastStepSelectedValues) },
            requestControler.signal
          );
          updateStep(stepId, {
            data: scheduleId,
            error: undefined
          });
        } catch (error) {
          if (!error instanceof DOMException ||
            error?.message !== 'The user aborted a request.') {
            updateStep(stepId, {
              data: undefined,
              error: error instanceof Error 
                ? error.message 
                : error
            });
          }
        }
        // setProcess({
        //   isLoading: false
        // })
      }
    })();
  }, []);
  const horariosGenerados = [];
  return !isLoading ? (
    <div sx={classes.root}>
      <SwipeableViews
        disabled
        axis={'x-reverse'}
        index={currentTableIndex - 1}
      >
        {horariosGenerados.map((horario, index) => (
          <React.Fragment key={index}>
            <ClassTable numHorario={index + 1} horario={horario} />
            <br />
            {/* <ButtonDialog numHorario={index + 1} horario={horario} /> */}
          </React.Fragment>
        ))}
      </SwipeableViews>

      <Pagination
        count={horariosGenerados.length}
        color={'primary'}
        onChange={(event, value) => {
          setCurrentTable(value);
        }}
      />
    </div>
  ) : (
    <Backdrop
      sx={classes.backdrop}
      open={!(horariosGenerados && horariosGenerados.length > 0)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default TableView;
