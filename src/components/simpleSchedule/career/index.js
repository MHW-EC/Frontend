
import React, { useContext, useState, useEffect, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import StepsContext from './../Context';
import MainContext from './../../Context';
import Grid from '@mui/material/Grid';
import { getData } from './../../../services';

export default function CareerStep(props) {
  const { stepId } = props;
  const { process, setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const [open, setOpen] = useState(false);
  const step = steps[Number(stepId)];
  const {
    selectedValues: stepSelectedValues,
    data: stepData,
    description: stepDescription
  } = step;
  const {
    isLoading
  } = process;
  const requestControler = useMemo(() => new AbortController(), []);
  const abortSignal = requestControler.signal;

  useEffect(() => {
    return () => requestControler.abort();
  }, [requestControler]);

  const fetchDataIfNeeded = async () => {
    if (!isLoading && !stepData) {
      try {
        setProcess({
          isLoading: true,
          progress: {
            variant: 'indeterminate'
          }
        });
        const careerOptions = await getData({
          resourceName: 'Career',
          query: 'getAll',
          projectedFields: ['_id', 'facultad', 'nombre']
        }, abortSignal);
        updateStep(stepId, {
          data: careerOptions,
          error: undefined
        });
      } catch (error) {
        console.log(error);
        if (!error instanceof DOMException ||
          error?.message !== 'The user aborted a request.') {
          updateStep(stepId, {
            data: undefined,
            error: error instanceof Error 
              ? error.message 
              : error
          });
        }
      }
      setProcess({
        isLoading: false
      });
    }
  };

  return (
    <Grid
      container={true}
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
            setOpen(true);
            fetchDataIfNeeded();
          }}
          onClose={() => setOpen(false)}
          onChange={(_, values) => {
            updateStep(stepId, {
              selectedValues: values
            });
          }}
          value={stepSelectedValues || { nombre: '',
            facultad: '' }}
          isOptionEqualToValue={
            (option, value) => option.title === value.title
          }
          getOptionLabel={
            ({ nombre, facultad }) => nombre ? `${nombre} - ${facultad}` : ''
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
                )
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
