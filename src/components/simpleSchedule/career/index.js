
import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import StepsContext from './../Context';
import MainContext from './../../Context';
import { getData } from './../../../services';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
const topFilms = [
  {
    id: 1,
    title: 'Ejemplo 1'
  },
  {
    id: 2,
    title: 'Ejemplo 2'
  }
]
export default function CareerStep(props) {
  const { stepId } = props
  const { setProcess } = useContext(MainContext);
  const { updateStep } = useContext(StepsContext);
  const [options, setOptions] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDataIfNeeded = async () => {
    if(!loading && options == undefined){
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
        setOptions(careerOptions);
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
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true)
        fetchDataIfNeeded()
        }
      }
      onClose={() => setOpen(false)}
      isOptionEqualToValue={
        (option, value) => option.title === value.title
      }
      getOptionLabel={
        (option) => option.nombre || ""
      }
      options={options || []}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="CareerStep"
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

