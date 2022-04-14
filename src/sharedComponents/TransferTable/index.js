import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import utils from './../utils';
import { DataGrid } from '@mui/x-data-grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
              paginationMode: "server",
              onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
              onPageSizeChange: (pageSize) => setPagination((prev) => ({ ...prev, pageSize, page: 0 }))
            }
            : {})
        }
        disableSelectionOnClick={true}
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
  console.log({left, right, leftChecked, rightChecked});

  const handleCheckedToRight = () => {
    setRight(utils.Array.union(right, leftChecked, rowsEquals))
  };

  const handleCheckedToLeft = () => {
    const result = utils.Array.difference(right, rightChecked, rowsEquals);
    setRight(result)
    setRightChecked(result)
  };

  return (
    <>
      <Grid item
        xs={12}
        sm={10}
        md={8}
        lg={5}
        xl={5}>
        <TableWrapper
          rows={left}
          rowIdGetter={getRowId}
          style={tableStyle}
          columns={columns}
          onSelectionModelChange={(items)=> {
            setLeftChecked(items)
          }}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}/>
      </Grid>
      <Grid item
        xs={10}
        sm={4}
        md={12}
        lg={1}
        xl={1}>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedToRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            <ContentCopyIcon/>
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedToLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            <DeleteOutlineIcon/>
          </Button>
        </Grid>
      </Grid>
      <Grid item
        xs={12}
        sm={10}
        md={8}
        lg={5}
        xl={5}>
        <TableWrapper
          rows={right}
          rowIdGetter={getRowId}
          style={tableStyle}
          columns={columns}
          onSelectionModelChange={(items)=> {
            setRightChecked(items);
          }}
          />
      </Grid>
    </>
  );
}
