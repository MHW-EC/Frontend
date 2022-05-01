
import React, {useCallback} from 'react';
import Grid from '@mui/material/Grid';
import HelperText from '@mui/material/FormHelperText';

export default (props) => {
  const { selectedClasses } = props;
  const preparePayload = useCallback((lastSelected = {}) => {
    const requestBody = [];
    for (const classCode in lastSelected) {
      if (lastSelected[classCode] instanceof Object) {
        for (const theoryClassId in lastSelected[classCode]) {
          if (lastSelected[classCode][theoryClassId] instanceof Object) {
            for (const practicalClassId in lastSelected[classCode][
              theoryClassId
            ]) {
              if (lastSelected[classCode][theoryClassId][practicalClassId]) {
                requestBody.push([theoryClassId, practicalClassId]);
              }
            }
          }
        }
      }
    }
    return requestBody;
  }, []);
  console.log({ total: preparePayload(selectedClasses) });

  return (
    <Grid
      item
      xs={12}>
      <HelperText
        sx={{
          textAlign: 'center'
        }}>
        {
          `You have been selected: ${
            preparePayload(selectedClasses).map(classes => {
              const [
                subjectCode, theoricalCode, practicalcode
              ] = classes[1].split('_');
              if(!subjectCode && !theoricalCode && !practicalcode) return undefined;
              return `${subjectCode} with parallel ${theoricalCode} and ${practicalcode}`
            }).filter(a => a).join('; ')
          }.`
        }
      </HelperText>
    </Grid>
  );
}

