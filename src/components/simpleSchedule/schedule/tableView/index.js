import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {
  Pagination,
  Backdrop,
  LinearProgress,
  Grid
} from '@mui/material';
import HelperText from '@mui/material/FormHelperText';

import SwipeableViews from 'react-swipeable-views';
import ClassTable from './ClassTable';
import StepsContext from './../../Context';
import { generate } from './../../../../services';
import CalendarView from '../calendarView';
import { app } from '../../../../firebase';
import { getFirestore } from 'firebase/firestore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Box } from '@mui/system';
import ReactTextTransition from "react-text-transition";
const db = getFirestore(app);

const randomText = [
  'Mejoramiento es todo 💪🏼',
  'La materia se repite, una fiesta no 🍻',
  'Si te tocó baldeo, ten varias opciones de horarios 👀',
  'Cuanto te toca examen de Diferenciales: Diooos esta aquiii 🎸'
];

const TableView = (props) => {
  const { stepId, lastStepId } = props;
  const { steps, updateStep } = useContext(StepsContext);
  const step = steps[Number(stepId)];
  const { helperText: stepHelperText } = step;
  const lastStep = steps[Number(lastStepId)];
  const {
    data: lastStepData = {},
    selectedValues: lastStepSelectedValues = {},
  } = lastStep;

  const [ isLoading, setLoading ] = useState();
  const [dataFirebase, setDataFirebase] = useState();
  const [textIdx, setTextIdx] = useState(0);
  const [currentTableIndex, setCurrentTable] = useState(1);
  const [horariosGenerados, setHorariosGenerados] = useState([]);
  const requestController = useMemo(() => new AbortController(), []);
  const preparePayload = useCallback((lastData = {}, lastSelected = {}) => {
    const requestBody = [];
    for (const classCode in lastSelected) {
      if (lastSelected[classCode] instanceof Object) {
        for (const theoryClassId in lastSelected[classCode]) {
          //empty array
          const classPackage = [];
          if (lastSelected[classCode][theoryClassId]) {
            const theoryClassObject = lastData[classCode].find(
              (_class) => _class._id == theoryClassId
            );
            if (theoryClassObject) classPackage.push(theoryClassObject);
            //extract theory class
            //append to empty array
          }
          if (lastSelected[classCode][theoryClassId] instanceof Object) {
            for (const practicalClassId in lastSelected[classCode][
              theoryClassId
            ]) {
              if (lastSelected[classCode][theoryClassId][practicalClassId]) {
                const practicalClassObject = lastData[theoryClassId].find(
                  (_class) => _class._id == practicalClassId
                );
                if (practicalClassObject)
                  classPackage.push(practicalClassObject);
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
  
  const getJobData = (docId) => {
    const q = query(
      collection(db, 'geneated-schedules'),
      where('uuid', '==', docId)
    );
    const unSubFunc = onSnapshot(
      q,
      (snapshot) => {
        const snapChanges = snapshot.docChanges();
        if (snapChanges.length === 0) {
          return;
        }
        const docData = snapChanges[0]?.doc.data();
        setDataFirebase(docData);
      },
      (error) => console.log('error: ', error)
    );
    window.unSubFunc = unSubFunc;
  };

  useEffect(() => {
    if (dataFirebase?.percentage === 100) {
      setLoading(false);
      window.unSubFunc();
      setHorariosGenerados(dataFirebase.horarios);
    }
  }, [!!window.unSubFunc, dataFirebase?.percentage]);

  useEffect(() => {
    (async () => {
      if (!isLoading) {
        try {
          setLoading(true);
          const scheduleId = await generate(
            { body: preparePayload(lastStepData, lastStepSelectedValues) },
            requestController.signal
          );
          updateStep(stepId, {
            data: scheduleId,
            error: undefined,
          });
          console.log('scheduleId: ', scheduleId);
          setTimeout(() => getJobData(scheduleId), 1000);
        } catch (error) {
          console.log(error);
          if (
            !error instanceof DOMException ||
            error?.message !== 'The user aborted a request.'
          ) {
            updateStep(stepId, {
              data: undefined,
              error: error instanceof Error ? error.message : error,
            });
          }
          setLoading(false);
        }
      }
    })();
  }, []);
  useEffect(() => {
    const intervalID = setInterval(() => setTextIdx(prev => prev + 1), 6000);
    return () => clearInterval(intervalID);
  }, []);
  return !isLoading ? (
    <Box>
      <Box>
        <HelperText>
          {stepHelperText}
        </HelperText>
      </Box>
      <SwipeableViews disabled axis={'x-reverse'} index={currentTableIndex - 1}>
        {horariosGenerados.map((horario, index) => (
          <React.Fragment key={index}>
            <ClassTable scheduleInfo={horario} numHorario={index + 1} />
            <CalendarView numHorario={index + 1} scheduleInfo={horario} />
          </React.Fragment>
        ))}
      </SwipeableViews>

      <Pagination
        sx={{
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'center'
        }}
        count={horariosGenerados.length}
        color={'primary'}
        onChange={(event, value) => {
          setCurrentTable(value);
        }}
      />
    </Box>
  ) : (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: '#fff',
      }}
      open={!(horariosGenerados && horariosGenerados.length > 0) || true}
    >
      <Grid
        container
        spacing={5}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={6}>
          <ReactTextTransition
            style={{ fontSize: '32px' }}
            text={randomText[textIdx % randomText.length]}
            overflow
          />
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ width: "350px"}}>
            <LinearProgress
              variant={!!dataFirebase?.percentage ? 'determinate' : 'indeterminate'}
              value={dataFirebase?.percentage}/>
          </Box>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

export default TableView;
