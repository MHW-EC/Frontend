import React, { useEffect, useContext, useMemo } from 'react';
import StepsContext from '../Context';
import MainContext from '../../Context';
import { getData } from '../../../services';

import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Card from '@mui/material/Card';

import CardTeorico from './TheoryClass';
import Skeleton from '@mui/material/Skeleton';

// import CustomImageList from './CustomImageList';

const classes = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  rootCard: {
    maxWidth: 400,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  cardActions: {
    backgroundColor: (theme) => theme.palette.primary.main,
  },
  cardContent: {
    height: '300px',
    padding: 2,
    overflow: "auto",
    whiteSpace: "nowrap"
  },
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    black: '#000000',
    white: '#ffffff',
  },
  nombreMateria: {
    color: '#ffffff',
    width: '-webkit-fill-available',
  },
}

export default function CardMateria(props) {
  const { setProcess } = useContext(MainContext);

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
  console.log({ theoryClasses });

  const requestControler = useMemo(() => new AbortController(), []);
  const abortSignal = requestControler.signal;
  useEffect(() => {
    return () => requestControler.abort();
  }, [requestControler]);

  useEffect(() => {
    (async () => {
      if (!theoryClasses) {
        try {
          setProcess({
            isLoading: true,
            progress: {
              variant: 'indeterminate'
            }
          })

          const result = await getData({
            resourceName: "TheoryClass",
            query: "getStatsByCode",
            queryParams: {
              classCode: theoryClassCode
            }
          }, abortSignal);

          updateStep(
            stepId,
            {
              data: {
                ...stepData,
                [theoryClassCode]: result
              },
              error: undefined
            }
          )
        } catch (error) {
          updateStep(stepId, {
            data: undefined,
            error: error instanceof Error
              ? error.message
              : error
          })
        }
        setProcess({
          isLoading: false
        })
      }
    })()
  }, [abortSignal, setProcess, stepData, stepId, theoryClassCode, theoryClasses, updateStep]);

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
              <CardTeorico
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
        <div sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
          <Skeleton animation="wave" variant="text" height={15} />
        </div>
      </CardActions>
    </Card>
  );
}
