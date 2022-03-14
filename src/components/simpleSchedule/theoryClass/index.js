
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

import TransferTable from './../../../sharedComponents/TransferTable';
import Grid from '@mui/material/Grid';

const THEORY_CLASS_TABLE_PAGES = [5, 10, 25, 50]

export default function TheoryClassStep(props) {
  const { stepId } = props
  const { process, setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const step = steps[Number(stepId)];
  const {
    checkedValues: stepCheckedValues = [],
    selectedValues: stepSelectedValues = [],
    data: stepData = [],
    description: stepDescription
  } = step;
  console.log("TheoryClass", step);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: THEORY_CLASS_TABLE_PAGES[0],
    totalItems: 0,
    rowsPerPageOptions: THEORY_CLASS_TABLE_PAGES
  })
  
  const {
    isLoading
  } = process;

  const getElementId = (element) => element._id;
  const [queryString, setQuery] = useState("");

  const tableColumns = [
    { field: '_id', headerName: 'Id', width: 150 },
    { field: 'codigo', headerName: 'Code', width: 150 },
    { field: 'nombre', headerName: 'Name', width: 150 },
    { field: 'paralelo', headerName: 'Course', width: 150 },
    { field: 'profesor', headerName: 'Teacher', width: 150 },
  ]

  // useEffect(() => {
  //   (async () => {
  //     if (!isLoading && !stepData) {
  //       try {
  //         setProcess({
  //           isLoading: true,
  //           progress: {
  //             variant: 'indeterminate'
  //           }
  //         })

  //         const {
  //           page,
  //           pageSize
  //         } = pagination;

  //         const matchesPracticalClass = await getData({
  //           resourceName: 'TheoryClass',
  //           query: 'getByQuery',
  //           queryParams: {
  //             target: queryString,
  //             pagination: {
  //               from: pageSize * (page - 1),
  //               pageSize
  //             }
  //           },
  //           projectedFields: [
  //             "_id", "codigo", "nombre",
  //             "paralelo", "profesor"
  //           ]
  //         })
  //         updateStep(stepId, {
  //           data: matchesPracticalClass,
  //           error: undefined
  //         })
  //       } catch (error) {
  //         updateStep(stepId, {
  //           data: undefined,
  //           error: error instanceof Error
  //             ? error.message
  //             : error
  //         })
  //       }
  //       setProcess({
  //         isLoading: false
  //       })
  //     }
  //   })();
  // }, [pagination.page]);

  const updateTotalRows = async () => {
    if (!isLoading) {
      try {
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
          },
          {
            id: '2-1'
          }
        )
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
      setProcess({
        isLoading: false
      })
    }
  }
  const updateRows = async () => {
    if (!isLoading) {
      try {
        setProcess({
          isLoading: true,
          progress: {
            variant: 'indeterminate'
          }
        })

        const result = await getData({
          resourceName: "TheoryClass",
          query: "getByQuery",
          queryParams: {
            target: "jedrez",
            pagination: {
              from: pagination.page * pagination.pageSize,
              pageSize: pagination.pageSize
            }
          },
          projectedFields: tableColumns.map(tC => tC.field)
      },
          {
            id: '2-2'
          }
        )
        updateStep(
          stepId,
          {
            data: result,
            error: undefined
          }
        )
      } catch (error) {
        updateStep(stepId, {
          data: undefined,
          error: error instanceof Error
            ? error.message
            : error
        })
      }
      setProcess({
        isLoading: false
      })
    }
  }

  const handleSearch = async (event) => {
    await updateTotalRows();
    await updateRows();
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  // const handleSetPage = (newPage) => {
  //   setPagination({
  //     ...pagination,
  //     page: newPage
  //   })
  // }
  // const handleSetPageSize = (newPageSize) => {
  //   setPagination({
  //     ...pagination,
  //     pageSize: newPageSize
  //   })
  // }

  // const handleToConfirmed = () => {
  //   setRight(right.concat(searchedChecked));
  //   setLeft(not(left, searchedChecked));
  //   setGlobalSelected(not(globalSelected, searchedChecked));
  // };

  // const handleToSearched = () => {
  //   setLeft(left.concat(confirmedChecked));
  //   setRight(not(right, confirmedChecked));
  //   setGlobalSelected(not(globalSelected, confirmedChecked));
  // };

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
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <FormControl variant="outlined" sx={{
            'width': '100%'
          }}>
            <InputLabel htmlFor="component-outlined">{stepDescription}</InputLabel>
            <OutlinedInput
              id="component-outlined"
              value={queryString}
              onChange={(event) => { setQuery(event.target.value) }}
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
        </Box>
      </Grid>
      <Grid xs={12}>
        <TransferTable
          checked={stepCheckedValues}
          setChecked = {(values) => updateStep(stepId, {
            checkedValues: values
          })}
          left={stepData}
          setLeft = {(values) => { 
            console.log("setting left", values);
            updateStep(
              stepId,
              {
                data: values
              }
            )
          }}
          right={stepSelectedValues}
          setRight = {(values) => {
            console.log("setting right", values);
            updateStep(
              stepId,
              {
                selectedValues: values
              }
            )
          }}
          columns={tableColumns}
          tableStyle={{ height: 400, width: '100%' }}
          getRowId={getElementId}
          rowsEquals={
            (row, anotherRow) => row._id == anotherRow._id
          } />
      </Grid>
    </Grid>
  );
}

