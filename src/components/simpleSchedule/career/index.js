import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Autocomplete } from '@mui/material';
import StepsContext from './../Context';
import MainContext from './../../Context';
import { getData } from './../../../services';

export default function CareerStep(props) {
  const { stepId } = props;
  const { setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const step = steps[Number(stepId)];
  const {
    selectedValues: stepSelectedValues,
    data: stepData,
    description: stepDescription,
  } = step;
  console.log({ step, stepDescription });
  const fetchDataIfNeeded = async () => {
    if (!loading && !stepData) {
      try {
        setLoading(true);
        setProcess({
          isLoading: true,
          progress: {
            variant: 'indeterminate',
          },
        });
        const careerOptions = await getData({
          resourceName: 'Career',
          query: 'getAll',
        });
        updateStep(stepId, {
          data: careerOptions,
          error: undefined,
        });
      } catch (error) {
        updateStep(stepId, {
          data: undefined,
          error: error instanceof Error ? error.message : error,
        });
      }
      setLoading(false);
      setProcess({
        isLoading: false,
      });
    }
  };

  return (
    <Grid
      pt={12}
      container
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
        <Autocomplete
          fullWidth
          autoComplete
          clearOnEscape
          open={open}
          onOpen={() => {
            setOpen(true);
            fetchDataIfNeeded();
          }}
          onClose={() => setOpen(false)}
          onChange={(_, values) => {
            console.log({ values });
            updateStep(stepId, {
              selectedValues: values,
            });
          }}
          defaultValue={stepSelectedValues}
          isOptionEqualToValue={(option, value) => option.title === value.title}
          getOptionLabel={(option) => option.nombre || ''}
          options={stepData || []}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={stepDescription}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
