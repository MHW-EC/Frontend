import React, {
  useEffect, useContext, useMemo
} from 'react';
import StepsContext from '../Context';
import { getData } from '../../../services';

import {
  Typography,
  CardContent,
  CardActions,
  Card,
  Skeleton,
  Box
} from '@mui/material';
import ClassCard from './ClassCard';

export default (props) => {
  const {
    _class: {
      codigo: theoryClassCode,
      nombre: theoryClassName
    },
    stepId
  } = props;
  const { steps, updateStep } = useContext(StepsContext);
  const step = steps[Number(stepId)];
  const {
    data: stepData = {}
  } = step;
  const theoryClasses = stepData[theoryClassCode];
  const requestControler = useMemo(() => new AbortController(), []);

  useEffect(() => {
    return () => requestControler.abort();
  }, [requestControler]);

  useEffect(() => {
    (async () => {
      if (theoryClassCode && !theoryClasses) {
        try {

          const result = await getData({
            resourceName: 'TheoryClass',
            query: 'getStatsByCode',
            queryParams: {
              classCode: theoryClassCode
            }
          }, requestControler.signal);

          updateStep(
            stepId,
            {
              data: {
                [theoryClassCode]: result
              },
              error: undefined
            },
            'data'
          );
        } catch (error) {
          console.log(error);
          updateStep(stepId, {
            error: error instanceof Error
              ? error.message
              : error
          });
        }
      }
    })();
  }, []);

  return theoryClasses ? (
    <Card
      elevation={3}>
        <CardActions sx={{
        backgroundColor: (theme) => theme.palette.primary.main,
        paddingLeft: '16px'
      }}>
        <Typography
          variant="body1"
          sx={{
            color: '#ffffff',
            width: '-webkit-fill-available'
          }}>
          {`${theoryClassName} - ${theoryClassCode}`}
        </Typography>
      </CardActions>
    
      <CardContent
        sx={{
          padding: 2,
          overflow: 'auto',
          whiteSpace: 'nowrap'
        }}>
        {
          theoryClasses.length === 0
            ? <Box sx={{
              height: "100%",
              display: "flex",
              alignItems: "center"}}><Typography align="center">
              {`THERE IS NO INFORMATION FOR ${theoryClassName} - ${theoryClassCode}`}
            </Typography></Box>
            : theoryClasses.map((practicalClass, index) => (
              <ClassCard
                key={`${practicalClass._id}_${index}`}
                stepId={stepId}
                paralelo={practicalClass}
                top={index === 0 && 
                  practicalClass?.lastParaleloProfesorJoined?.promedio !== null &&
                  practicalClass?.lastParaleloProfesorJoined?.promedio > 80}
              />
            ))
        }
      </CardContent>
      </Card>
  ) : (
    <Card elevation={3}>
      <CardActions>
        <Box sx={{
          width: '50%',
          marginLeft: '16px',
          marginRight: 'auto'
        }}>
          <Skeleton animation="wave" variant="text" height={15} />
        </Box>
      </CardActions>
    
      <CardContent sx={{ padding: 0 }}>
        <Skeleton animation="wave" variant="rect" height={250} />
      </CardContent>
      </Card>
  );
};
