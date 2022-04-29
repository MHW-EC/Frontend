import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Utils from './../../utils/functions';
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
    setPagination,
    onSelectionModelChange,
  } = props;
  return (
    <Box sx={{
      textAlign: "center"
    }}>
      <Typography variant="caption">
        {caption}
      </Typography>
      <DataGrid
        rows={rows}
        editMode={'row'}
        columns={columns}
        density={'compact'}
        onSelectionModelChange={(selectedRowsIds) =>
          onSelectionModelChange(
            selectedRowsIds.map((selectedId) =>
              rows.find((row) => rowIdGetter(row) === selectedId)
            )
          )
        }
        disableColumnMenu={true}
        checkboxSelection={true}
        getRowId={rowIdGetter}
        {...(pagination
          ? {
              ...pagination,
              loading: isLoading,
              pagination: true,
              paginationMode: 'server',
              onPageChange: (page) =>
                setPagination((prev) => ({ ...prev, page })),
              onPageSizeChange: (pageSize) =>
                setPagination((prev) => ({ ...prev, pageSize, page: 0 })),
            }
          : {})}
        disableSelectionOnClick={true}
      />
    </Box>
  );
};

export default function TransferTable(props) {
  const { getRowId, tableStyle, columns, rowsEquals } = props;
  const {
    leftChecked,
    setLeftChecked,
    left,
    right,
    setRight,
    rightChecked,
    setRightChecked,
    leftExtra,
  } = props;
  const { isLoading, pagination, setPagination } = leftExtra;

  const handleCheckedToRight = () => {
    setRight(Utils.sets.union(right, leftChecked, rowsEquals));
  };

  const handleCheckedToLeft = () => {
    const result = Utils.sets.difference(right, rightChecked, rowsEquals);
    setRight(result);
    setRightChecked(result);
  };

  return (
    <>
      <Grid item xs={10} sm={10} md={10} lg={10} xl={5}>
        <Box sx={{ width: tableStyle.width, margin: 'auto' }}>
          <Typography variant="caption">{'Available classes:'}</Typography>
        </Box>
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
          setPagination={setPagination}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={1}>
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
      <Grid item xs={10} sm={10} md={10} lg={10} xl={5}>
        <Box sx={{ width: tableStyle.width, margin: 'auto' }}>
          <Typography variant="caption">{'Selected classes:'}</Typography>
        </Box>
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
