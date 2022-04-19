
import React, { useContext } from 'react';

import StepsContext from './../Context';
import Grid from '@mui/material/Grid';
import Reel from "./Reel";

export default function PracticalClassStep(props) {
  const { stepId, lastStepId } = props
  const { steps } = useContext(StepsContext);
  const lastStep = steps[Number(lastStepId)];

  const {
    selectedValues: lastStepSelectedValues = []
  } = lastStep;

  const uniqueTheoryClassByCodes = [
    ...new Map(lastStepSelectedValues.map(item => [item.codigo, item])
    ).values()
  ]

  return (
    <Grid
      container={true}
      spacing={3}
      justifyContent="center"
      alignItems="flex-start">
      {
        uniqueTheoryClassByCodes.map((_class) => (
					<Grid
						key={_class.codigo}
						item
						xs={12}
						xl={10}
						sm={9}
						md={7}
						lg={7}>
						<Reel 
              _class={_class}
              stepId={stepId}/>
					</Grid>
				))
      }
    </Grid>
  );
}

