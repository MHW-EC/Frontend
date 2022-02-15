
import React, { useContext, useState, useEffect } from 'react';

import StepsContext from './../Context';
import MainContext from './../../Context';
import SearchIcon from '@mui/icons-material/Search';
import { getData } from './../../../services';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

export default function CareerStep(props) {
  const ITEMS_PER_PAGE = 10;
  const { stepId } = props
  const { setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: ITEMS_PER_PAGE,
    totalItems: 0
  })
  const step = steps[Number(stepId)];
  const {
    //selectedValues: stepSelectedValues,
    data: stepData,
    description: stepDescription
  } = step;
  console.log({ step, stepDescription });

  const [queryString, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      if (!loading && !stepData) {
        try {
          setLoading(true);
          setProcess({
            isLoading: true,
            progress: {
              variant: 'indeterminate'
            }
          })

          const {
            page,
            pageSize
          } = pagination;

          const matchesPracticalClass = await getData({
            resourceName: 'TheoryClass',
            query: 'getByQuery',
            queryParams: {
              target: queryString,
              pagination: {
                from: pageSize * (page - 1),
                pageSize
              }
            },
            projectedFields: [
              "_id", "codigo", "nombre",
              "paralelo", "profesor"
            ]
          })
          updateStep(stepId, {
            data: matchesPracticalClass,
            error: undefined
          })
        } catch (error) {
          updateStep(stepId, {
            data: undefined,
            error: error instanceof Error
              ? error.message
              : error
          })
        }
        setLoading(false);
        setProcess({
          isLoading: false
        })
      }
    })();
  }, [pagination.page]);

  const handleSearch = async () => {
    //code
    if (!loading) {
      try {
        setLoading(true);
        setProcess({
          isLoading: true,
          progress: {
            variant: 'indeterminate'
          }
        })

        const totalMatches = await getData({
          resourceName: 'TheoryClass',
          query: 'getTotalOfRecords',
          queryParams: {
            target: queryString
          }
        })
        setPagination({
          ...pagination,
          totalItems: totalMatches
        })

      } catch (error) {
        updateStep(stepId, {
          data: undefined,
          error: error instanceof Error
            ? error.message
            : error
        })
      }
      setLoading(false);
      setProcess({
        isLoading: false
      })
    }
  };
  const handleMouseDown = (event) => {
    event.preventDefault();
  };
  // m={6}
  // mt={3}
  // sx={{ display: 'flex', flexWrap: 'wrap' }}
  // sx={{
  //   width: 'auto',
  //   "> *": {
  //     margin: "auto"
  //   }
  // }}
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <FormControl variant="outlined">
        <InputLabel htmlFor="component-outlined">{stepDescription}</InputLabel>
        <OutlinedInput
          id="component-outlined"
          value={queryString}
          onChange={(event) => {setQuery(event.target.value)}}
          label={stepDescription}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="search by queryString"
                onClick={handleSearch}
                onMouseDown={handleMouseDown}
                edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box >
  );
}

