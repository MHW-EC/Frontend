import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  Typography
} from '@mui/material';

import Highcharts from 'highcharts';
import Light from 'highcharts/themes/grid-light';
import HighchartsReact from 'highcharts-react-official';

export default function ConfirmationDialogRaw(props) {
  const { 
    profesor, data, onClose, 
    value: valueProp, open, 
    ...other 
  } = props;
  

  const handleClose = () => {
    onClose();
  };

  const processData = (data, profesorT) => {
    const categories = Object.keys(data)
    const values = Object.values(data)
    return {
      chart: {
        polar: true,
      },
      exporting: {
        enabled: false,
      },
      title: null,
      pane: {
        size: '80%',
      },
      accessibility: {
        description: `What does this graph mean? The tip of the polygon becomes sharper
        toward the most frequent sentiment found in opinions about
        this teacher. This information is based on at least 15 opinions
        given by students who have taken courses with this teacher.`,
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories,
        tickmarkPlacement: 'on',
        lineWidth: 0,
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        max: 100,
      },
      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{series.color}">percentage: <b>{point.y}%</b><br/>',
      },
      series: [
        {
          name: profesorT,
          type: 'area',
          data: values.map(value => value * 100),
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal'
              },
              pane: {
                size: '65%',
              },
            },
          },
        ],
      },
    };
  };

  require('highcharts/highcharts-more')(Highcharts);
  // Light(Highcharts);

  return data ? (
    <Dialog
      fullWidth={true}
      disableEscapeKeyDown
      maxWidth="sm"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        {"Teacher results"}
      </DialogTitle>
      <DialogContent 
        dividers 
        sx={{
          alignItems: 'center',
          padding: "0px 16px",
        }}>
        <HighchartsReact
          key={'light'}
          highcharts={Highcharts}
          options={processData(data, profesor)}
        />
        <Typography variant="caption" align="center">
          {`What does this chart mean? The tip of the polygon becomes sharper
          toward the most frequent sentiment found in opinions about
          this teacher. This information is based on at least 15 opinions
          given by students who have taken courses with this teacher.`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          {"Accept"}
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
}