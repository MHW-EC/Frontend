import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Array } from './../utils';
import { DataGrid } from '@mui/x-data-grid';


const TableWrapper = (props) => {
  const {
    rows,
    rowIdGetter,
    columns,
    onSelectionModelChange,
    style,
    isLoading,
    pagination,
    setPagination
  } = props;
  return (
    <div
      style={style}>
      <DataGrid
        rows={rows}
        columns={columns}
        density={'compact'}
        editMode={'row'}
        onSelectionModelChange={
          (selectedRowsIds) => (
            onSelectionModelChange(
              selectedRowsIds.map(
                selectedId => rows.find(
                  row => rowIdGetter(row) == selectedId
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
              paginationMode: "server",
              onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
              onPageSizeChange: (pageSize) => setPagination((prev) => ({ ...prev, pageSize, page: 0 }))
            }
            : {})
        }
        />
    </div>
  )
}

export default function TransferTable(props) {
  const {
    getRowId,
    tableStyle,
    columns,
    rowsEquals
  } = props;
  const {
    checked, setChecked,
    left, setLeft,
    right, setRight,
    leftExtra
  } = props;
  const {
    isLoading,
    pagination,
    setPagination
  } = leftExtra;

  console.log({left, right, checked});
  console.log({leftExtra});

  const leftChecked = Array.intersection(checked, left, rowsEquals);
  const rightChecked = Array.intersection(checked, right, rowsEquals);

  const numberOfChecked = (items) => Array.intersection(checked, items, rowsEquals).length;

  const handleToggleAll = (items) => {
    if (numberOfChecked(items) === items.length) {
      setChecked(Array.difference(checked, items, rowsEquals));
    } else {
      setChecked(Array.union(checked, items, rowsEquals));
    }
  };

  const handleAllLeft = () => {// <-
    setLeft(left.concat(right));
    setRight([]);
    setChecked(Array.difference(checked, rightChecked, rowsEquals));
  }

  const handleAllRight = () => {// ->
    setRight(right.concat(left));
    setLeft([]);
    setChecked(Array.difference(checked, leftChecked, rowsEquals));
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(Array.difference(left, leftChecked, rowsEquals));
    setChecked(Array.difference(checked, leftChecked, rowsEquals));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(Array.difference(right, rightChecked, rowsEquals));
    setChecked(Array.difference(checked, rightChecked, rowsEquals));
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center">
      <Grid item>
        <TableWrapper
          rows={left}
          rowIdGetter={getRowId}
          style={tableStyle}
          columns={columns}
          onSelectionModelChange={handleToggleAll}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}/>
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <TableWrapper
          rows={right}
          rowIdGetter={getRowId}
          style={tableStyle}
          columns={columns}
          onSelectionModelChange={handleToggleAll} />
      </Grid>
    </Grid>
  );
}
