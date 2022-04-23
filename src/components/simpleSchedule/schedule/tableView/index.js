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

import { app } from '../../../../firebase';
import { getFirestore } from "firebase/firestore";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const db = getFirestore(app);

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
  const { process, setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
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
  const {
    isLoading
  } = process;
  const [open, setOpen] = useState();
  const [currentTableIndex, setCurrentTable] = useState(1);
  const requestControler = useMemo(() => new AbortController(), []);
  const preparePayload = useCallback((lastData = {}, lastSelected = {}) => {
    const requestBody = [];
    for (const classCode in lastSelected) {
      if (lastSelected[classCode] instanceof Object) {
        for (const theoryClassId in lastSelected[classCode]) {
          //empty array
          const classPackage = [];
          if (lastSelected[classCode][theoryClassId]) {
            const theoryClassObject = lastData[classCode].find(_class => _class._id == theoryClassId);
            if (theoryClassObject) classPackage.push(theoryClassObject);
            //extract theory class
            //append to empty array
          }
          if (lastSelected[classCode][theoryClassId] instanceof Object) {
            for (const practicalClassId in lastSelected[classCode][theoryClassId]) {
              if (lastSelected[classCode][theoryClassId][practicalClassId]) {
                const practicalClassObject = lastData[theoryClassId].find(_class => _class._id == practicalClassId);
                if (practicalClassObject) classPackage.push(practicalClassObject);
                //extract practical class
                //append to empty array
              }
            }
          }
          requestBody.push(classPackage);
          //append array to request
        }
      }
    }
    return requestBody;
  }, []);
  const [dataFirebase, setDataFirebase] = useState();
  const [horariosGenerados, setHorariosGenerados] = useState([]);
  
  const getJobData = (docId) => {
    console.log('getJobData docId: ', docId, db);
    const q = query(collection(db, 'geneated-schedules'), where('uuid', '==', docId));
    const unSubFunc = onSnapshot(q, (snapshot) => {
      console.log('getJobData snapshot: ', snapshot);
      const snapChanges = snapshot.docChanges();
      if (snapChanges.length === 0) {
        console.log('snapChanges.length === 0');
        return;
      }
      const docData = snapChanges[0]?.doc.data();
      console.log('docRaw: ', docData);
      setProcess({
        isLoading: true,
        progress: {
          variant: "determinate",
          value: docData.percentage || 0,
        }
      });
      setDataFirebase(docData);
    }, (error) => console.log('error: ', error));
    console.log('unSubFunc: ', !!unSubFunc);	
    window.unSubFunc = unSubFunc;
  }

  useEffect(() => {
    console.log('Effect firebase', !!window.unSubFunc);
    if (dataFirebase?.percentage === 100) {
      setProcess({
        value: 100,
        isLoading: false,
        variant: "determinate"
      });
      window.unSubFunc();
      setHorariosGenerados(dataFirebase.horarios);
    }
  }, [!!window.unSubFunc, dataFirebase?.percentage]);

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
          getJobData(scheduleId);
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
      {'We are generating your schedules, progress: '} {dataFirebase?.percentage || 0}%
    </Backdrop>
  );
};

export default TableView;
