import React, { 
  useEffect, useContext, useMemo, useState } from 'react';
import StepsContext from '../Context';
// import MainContext from '../../Context';
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

// import CustomImageList from './CustomImageList';

const classes = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: 'transparent'
  },
  rootCard: {
    maxWidth: 400,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  cardActions: {
    backgroundColor: (theme) => theme.palette.primary.main,
    paddingLeft: '16px'
  },
  cardContent: {
    height: '300px',
    padding: 2,
    overflow: 'auto',
    whiteSpace: 'nowrap'
  },
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000'
    },
    black: '#000000',
    white: '#ffffff'
  },
  nombreMateria: {
    color: '#ffffff',
    width: '-webkit-fill-available'
  }
};

export default (props) => {
  // const { setProcess } = useContext(MainContext);

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
  const [localLoading, setLoading] = useState(false);
  const requestControler = useMemo(() => new AbortController(), []);
  
  useEffect(() => {
    return () => requestControler.abort();
  }, [requestControler]);

  useEffect(() => {
    (async () => {
      if (theoryClassCode && !theoryClasses) {
        try {
          setLoading(true);

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
          updateStep(stepId, {
            // data: undefined,
            error: error instanceof Error
              ? error.message
              : error
          });
        }
        setLoading(false);
      }
    })();
  }, []);

  return theoryClasses ? (
    <Card
      elevation={3}>
      <CardContent
        sx={classes.cardContent}>
        {
          theoryClasses.length === 0
            ? <Typography align="center">
              {`THERE IS NO INFORMATION FOR ${theoryClassName} - ${theoryClassCode}`}
            </Typography>
            : theoryClasses.map((practicalClass, index) => (
              <ClassCard
                key={String(index)}
                stepId={stepId}
                paralelo={practicalClass}
                top={index === 0 && practicalClass['score'] !== null}
              />
            ))
        }
      </CardContent>
      <CardActions sx={classes.cardActions}>
        <Typography
          variant="body1"
          sx={classes.nombreMateria}>
          {`${theoryClassName} - ${theoryClassCode}`}
        </Typography>
      </CardActions>
    </Card>
  ) : (
    <Card elevation={6}>
      <CardContent sx={{ padding: 0 }}>
        <Skeleton animation="wave" variant="rect" height={250} />
      </CardContent>
      <CardActions>
        <Box sx={{ width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto' }}>
          <Skeleton animation="wave" variant="text" height={15} />
        </Box>
      </CardActions>
    </Card>
  );
};
