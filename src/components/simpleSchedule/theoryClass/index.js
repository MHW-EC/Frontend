
import React, {
  useContext, useState, useEffect,
  useMemo, useCallback
} from 'react';

import StepsContext from './../Context';
import MainContext from './../../Context';
import SearchIcon from '@mui/icons-material/Search';
import { getData } from './../../../services';

import InputLabel from '@mui/material/InputLabel';
import HelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import TransferTable from './../../../sharedComponents/TransferTable';
import Grid from '@mui/material/Grid';

export default function TheoryClassStep(props) {
  const { stepId, lastStepId } = props;
  const { process, setProcess } = useContext(MainContext);
  const { steps, updateStep } = useContext(StepsContext);
  const step = steps[Number(stepId)];
  const {
    selectedValues: stepSelectedValues = [],
    data: stepData = [],
    description: stepDescription,
    helperText: stepHelperText,
  } = step || {};
  const lastStep = steps[Number(lastStepId)];
  const {
    selectedValues: lastStepSelectedValue = {}
  } = lastStep;
  const {
    materias: lastStepClasses = []
  } = lastStepSelectedValue;

  const [searchChecked, setSearchChecked] = useState([]);
  const [selectedChecked, setSelectedChecked] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    rowCount: 0,
    rowsPerPageOptions: [10, 25, 50]
  });
  const {
    isLoading
  } = process;
  const getElementId = (element) => element._id;
  const [queryString, setQuery] = useState('');
  const requestControler = useMemo(() => new AbortController(), []);
  const abortSignal = requestControler.signal;

  const tableColumns = useMemo(() => [
    {
      field: 'codigo',
      headerName: 'CODE',
      width: 100
    },
    {
      field: 'nombre',
      headerName: 'NAME',
      width: 350
    },
    {
      field: '_id',
      headerName: 'ID',
      width: 125
    }
  ], []);

  useEffect(() => {// this will be replaced for a _id -> classCode
    updateStep(
      stepId,
      {
        data: lastStepClasses.map((l, idx) => ({...l, _id: `${l.codigo}_00${idx}`})),
        error: undefined
      }
    );
  }, []);

  useEffect(() => {
    return () => requestControler.abort();
  }, [requestControler]);

  const totalMatchesCb = useCallback(() => {
    return getData({
      resourceName: 'TheoryClass',
      query: 'getTotalOfRecords',
      queryParams: {
        target: queryString,
        distinctField: "codigo"
      }
    }, abortSignal);
  }, [queryString, abortSignal]);

  const resultCb = useCallback(() => {
    const {
      page,
      pageSize
    } = pagination;
    return getData({
      resourceName: 'TheoryClass',
      query: 'getByQuery',
      queryParams: {
        target: queryString,
        pagination: {
          from: page * pageSize,
          pageSize: pageSize
        },
        distinctField: "codigo"
      },
      projectedFields: tableColumns.map(tC => tC.field)
    }, abortSignal
    );
  }, [pagination, tableColumns, queryString, abortSignal]);

  useEffect(() => {
    (async () => {
      if (!isLoading && queryString?.length) {
        try {
          setProcess({
            isLoading: true,
            progress: {
              variant: 'indeterminate'
            }
          });
          const result = await resultCb();
          updateStep(
            stepId,
            {
              data: result,
              error: undefined
            }
          );
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
          setProcess({
            isLoading: false
          });
        }
      }}
    )();
  }, [pagination.page, pagination.pageSize]);

  const handleSearch = async () => {
    if (!isLoading) {
      try {
        setProcess({
          isLoading: true,
          progress: {
            variant: 'indeterminate'
          }
        });
        const [
          result, totalMatches
        ] = await Promise.all([resultCb(), totalMatchesCb()]);
        updateStep(
          stepId,
          {
            data: result,
            error: undefined
          }
        );
        setPagination({
          ...pagination,
          rowCount: totalMatches
        });
        setProcess({
          isLoading: false
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
        <Box
          component="form"
          noValidate
          autoComplete="off">
          <FormControl
            variant="outlined"
            sx={{
              'width': '100%'
            }}>
            <InputLabel
              htmlFor="component-outlined">
              {
                stepDescription
              }
            </InputLabel>
            <OutlinedInput
              id="component-outlined"
              value={queryString}
              onChange={(event) => { setQuery(event.target.value); }}
              label={stepDescription}
              onKeyPress={(event) => {
                if (event.code === 'Enter') {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="search by queryString"
                    onClick={handleSearch}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            <HelperText>
              {stepHelperText}
            </HelperText>
          </FormControl>
        </Box>
      </Grid>
      <Grid
        container
        spacing={1}
        sx={{
          paddingTop: '16px',
          paddingBottom: '64px'
        }}
        justifyContent="center"
        alignItems="center">
        <TransferTable
          leftChecked={searchChecked}
          setLeftChecked={setSearchChecked}
          left={stepData}
          leftExtra={{
            pagination,
            setPagination,
            isLoading
          }}
          right={stepSelectedValues}
          setRight={(values) => {
            updateStep(
              stepId,
              {
                selectedValues: values
              }
            );
          }}
          rightChecked={selectedChecked}
          setRightChecked={setSelectedChecked}
          columns={tableColumns}
          tableStyle={{
            height: 400,
            width: '100%'
          }}
          getRowId={getElementId}
          rowsEquals={(row, anotherRow) => row._id === anotherRow._id} />
      </Grid>
    </Grid>
  );
}

