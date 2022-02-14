
import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import StepsContext from './../Context';
import MainContext from './../../Context';
import { getData } from './../../../services';

export default function CareerStep(props) {
  const { stepId } = props
  const { setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const step = steps[Number(stepId)];
  const {
    selectedValues: stepSelectedValues,
    data: stepData,
    description: stepDescription
  } = step;
  console.log({step, stepDescription});
  const fetchDataIfNeeded = async () => {
    if(!loading && !stepData){
      try{
        setLoading(true);
        setProcess({
          isLoading: true,
          progress: {
            variant: 'indeterminate'
          }
        })
        const careerOptions = await getData({
          resourceName: 'Career',
          query: 'getAll'
        })
        updateStep(stepId, {
          data: careerOptions,
          error: undefined
        })
      }catch(error){
        updateStep(stepId, {
          data: undefined,
          error: error instanceof Error ? error.message : error
        })
      }
      setLoading(false);
      setProcess({
        isLoading: false
      })
    }
  }

  return (
    <Box m={6} mt={3} sx={{ width: 'auto', "> *": { margin: "auto" } }}>
      <Autocomplete
      autoComplete
      clearOnEscape
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true)
        fetchDataIfNeeded()
        }
      }
      onClose={() => setOpen(false)}
      onChange={(_, values) => {
        console.log({values})
        updateStep(stepId, {
          selectedValues: values
        })
      }}
      defaultValue={
        stepSelectedValues
      }
      isOptionEqualToValue={
        (option, value) => option.title === value.title
      }
      getOptionLabel={
        (option) => option.nombre || ""
      }
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
                {
                  params.InputProps.endAdornment
                }
              </React.Fragment>
            ),
          }}
        />
      )}
    />
    </Box>
  );
}

