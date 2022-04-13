
import React, { useContext } from 'react';

import StepsContext from './../Context';
import MainContext from './../../Context';
import Grid from '@mui/material/Grid';
import CardMateria from "./Reel";

export default function PracticalClassStep(props) {
  const { stepId, lastStepId } = props
  const { process, setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const step = steps[Number(stepId)];
  const lastStep = steps[Number(lastStepId)];

  const {
    selectedValues: stepSelectedValues = [],
    data: stepData = [],
    description: stepDescription
  } = step;

  const {
    selectedValues: lastStepSelectedValues = [],
    data: lastStepData = [],
    description: lastStepDescription
  } = lastStep;

  const {
    isLoading
  } = process;

  const uniqueTheoryClassByCodes = [
    ...new Map(lastStepSelectedValues.map(item => [item.codigo, item])
    ).values()
  ]
  console.log({uniqueTheoryClassByCodes});

  return (
    <Grid
      container={true}
      spacing={3}
      justifyContent="center"
      alignItems="flex-start">
      {
        uniqueTheoryClassByCodes.map((_class) => (
					<Grid
						key={_class.id}
						item
						xs={12}
						xl={10}
						sm={9}
						md={7}
						lg={7}>
						<CardMateria 
              _class={_class}
              stepId={stepId}/>
					</Grid>
				))
      }
    </Grid>
  );
}

