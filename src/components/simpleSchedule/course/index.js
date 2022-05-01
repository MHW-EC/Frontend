
import React, { useContext } from 'react';

import StepsContext from '../Context';
import Grid from '@mui/material/Grid';
import Reel from './Reel';
import HelperText from '@mui/material/FormHelperText';
import Resume from './Resume';

export default function PracticalClassStep(props) {
  const { stepId, lastStepId } = props;
  const { steps } = useContext(StepsContext);
  const lastStep = steps[Number(lastStepId)];
  const step = steps[Number(stepId)];

  const {
    helperText: stepHelperText,
    selectedValues: stepSelectedValues = {}
  } = step || {};
  const {
    selectedValues: lastStepSelectedValues = []
  } = lastStep;

  const uniqueTheoryClassByCodes = [
    ...new Map(lastStepSelectedValues.map(item => [item.codigo, item])
    ).values()
  ];

  return (
    <Grid
      container={true}
      spacing={3}
      justifyContent="center"
      alignItems="flex-start">
      <Grid
        item
        xs={12}>
        <HelperText
          sx={{
            textAlign: 'center'
          }}>
          {stepHelperText}
        </HelperText>
      </Grid>
      <Resume selectedClasses={stepSelectedValues}/>
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
              stepId={stepId} />
          </Grid>
        ))
      }
    </Grid>
  );
}

