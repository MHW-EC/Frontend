import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import utils from './../utils';
import { DataGrid } from '@mui/x-data-grid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const TableWrapper = (props) => {
  const {
    rows,
    style,
    columns,
    isLoading,
    pagination,
    rowIdGetter,
    caption = '',
    setPagination,
    onSelectionModelChange,
  } = props;
  return (
    <div>
      <Typography variant="caption">
        {caption}
      </Typography>
      <DataGrid
        style={style}
        rows={rows}
        columns={columns}
        density={'compact'}
        editMode={'row'}
        onSelectionModelChange={
          (selectedRowsIds) => (
            onSelectionModelChange(
              selectedRowsIds.map(
                selectedId => rows.find(
                  row => rowIdGetter(row) === selectedId
                )
              )
            )
          )
        }
        disableColumnMenu={true}
        checkboxSelection={true}
        getRowId={rowIdGetter} 
        {
          ...(pagination 
            ? {
              ...pagination,
              loading: isLoading,
              pagination: true,
              paginationMode: 'server',
              onPageChange: (page) => setPagination((prev) => ({ ...prev,
                page })),
              onPageSizeChange: (pageSize) => setPagination((prev) => ({ ...prev,
                pageSize,
                page: 0 }))
            }
            : {})
        }
        disableSelectionOnClick={true}
      />
    </div>
  );
};

export default function TransferTable(props) {
  const {
    getRowId,
    tableStyle,
    columns,
    rowsEquals
  } = props;
  const {
    leftChecked, setLeftChecked,
    left,
    right, setRight,
    rightChecked, setRightChecked,
    leftExtra
  } = props;
  const {
    isLoading,
    pagination,
    setPagination
  } = leftExtra;
  console.log({ left,
    right,
    leftChecked,
    rightChecked });

  const handleCheckedToRight = () => {
    setRight(utils.Array.union(right, leftChecked, rowsEquals));
  };

  const handleCheckedToLeft = () => {
    const result = utils.Array.difference(right, rightChecked, rowsEquals);
    setRight(result);
    setRightChecked(result);
  };

  return (
    <>
      <Grid item
        xs={10}
        sm={10}
        md={10}
        lg={10}
        xl={10}>
        <TableWrapper
          rows={left}
          caption={'Available classes:'}
          rowIdGetter={getRowId}
          style={tableStyle}
          columns={columns}
          onSelectionModelChange={(items) => {
            setLeftChecked(items);
          }}

          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}/>
      </Grid>
      <Grid item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedToRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            <ArrowForwardIosIcon />
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedToLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            <ArrowBackIosNewIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid item
        xs={10}
        sm={10}
        md={10}
        lg={10}
        xl={10}>
        <TableWrapper
          rows={right}
          caption={'Selected classes:'}
          rowIdGetter={getRowId}
          style={tableStyle}
          columns={columns}
          onSelectionModelChange={(items) => {
            setRightChecked(items);
          }}
        />
      </Grid>
    </>
  );
}
