import React from 'react';
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog
} from '@mui/material';
import PracticalForm from './PracticalForm';

const classes = {
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: (theme) => theme.palette.primary.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 435,
  },
  dialogContent: {
    alignItems: 'center',
    padding: 0,
  },
};

export default (props) => {
  const { 
    onClose, 
    open, 
    teoricoid,
    teorico,
    stepId,
    ...other
  } = props;

  return (
    <Dialog
      fullWidth={true}
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle 
        id="confirmation-dialog-title">
        {"Select practical class"}
      </DialogTitle>
      <DialogContent 
        dividers 
        sx={classes.dialogContent}>
        <PracticalForm
            stepId={stepId} 
            teoricoid={teoricoid}
            teorico={teorico} />
      </DialogContent>
      <DialogActions>
        <Button 
          autoFocus 
          onClick={onClose} 
          color="primary">
          {
            "Accept"
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
