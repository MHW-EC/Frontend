import React, { useCallback } from 'react';
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
          } else if (lastSelected[classCode][theoryClassId]) {
            requestBody.push([theoryClassId]);
          }
        }
      }
    }
    return requestBody;
  }, []);
  const preparedPayload = preparePayload(selectedClasses);

  return preparedPayload && preparedPayload.length > 0 ? (
    <Grid item xs={12}>
      <HelperText
        sx={{
          textAlign: 'center',
        }}
      >
        {`You have been selected: ${preparedPayload
          .map((classes) => {
            const [subjectCode, theoricalCode, practicalcode] = (
              classes[1] || classes[0]
            ).split('_');
            if (!subjectCode && !theoricalCode && !practicalcode)
              return undefined;
            if (subjectCode && theoricalCode && practicalcode)
              return `${subjectCode} with parallel ${theoricalCode} and ${practicalcode}`;
            return `${subjectCode} with parallel ${theoricalCode}`;
          })
          .filter((a) => a)
          .join('; ')}.`}
      </HelperText>
    </Grid>
  ) : (
    <></>
  );
};
