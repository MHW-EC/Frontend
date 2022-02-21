import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Autocomplete } from '@mui/material';
import StepsContext from './../Context';
import MainContext from './../../Context';
import Grid from '@mui/material/Grid';
import { getData } from './../../../services';

export default function CareerStep(props) {
  const { stepId } = props
  const { process, setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const [open, setOpen] = useState(false);
  const step = steps[Number(stepId)];
  const {
    selectedValues: stepSelectedValues,
    data: stepData,
    description: stepDescription,
  } = step;
  const {
    isLoading
  } = process
  console.log({ step, stepDescription });
  const fetchDataIfNeeded = async () => {
    if (!isLoading && !stepData) {
      try {
        setProcess({
          isLoading: true,
          progress: {
            variant: 'indeterminate',
          },
        });
        const careerOptions = await getData({
          resourceName: 'Career',
          query: 'getAll',
          projectedFields: ["_id", "facultad", "nombre"]
        }, {
          id: '1-1'
        })
        updateStep(stepId, {
          data: careerOptions,
          error: undefined
        })
      } catch (error) {
        updateStep(stepId, {
          data: undefined,
          error: error instanceof Error ? error.message : error,
        });
      }
      setProcess({
        isLoading: false,
      });
    }
  };

  return (
    <Grid
      container={true}
      spacing={3}
      justifyContent="center"
      alignItems="center">
      <Grid
        item
        xs={12}
        sm={8}
        md={8}
        lg={6}
        xl={6}>
        <Autocomplete
          autoComplete
          clearOnEscape
          //sx={{ width: 300 }}
          open={open}
          onOpen={() => {
            setOpen(true)
            fetchDataIfNeeded()
          }}
          onClose={() => setOpen(false)}
          onChange={(_, values) => {
            console.log({ values })
            updateStep(stepId, {
              selectedValues: values
            })
          }}
          value={stepSelectedValues || { nombre: "" , facultad: ""}}
          isOptionEqualToValue={
            (option, value) => option.title === value.title
          }
          getOptionLabel={
            ({nombre, facultad}) => nombre ? `${nombre} - ${facultad}` : ""
          }
          options={stepData || []}
          loading={isLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={stepDescription}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {
                      params.InputProps.endAdornment
                    }
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
