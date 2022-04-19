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
    cargado, 
    teoricoid,
    teorico,
    stepId,
    ...other
  } = props;


  const handleClose = () => {
    onClose();
  };

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
        className={classes.dialogContent}>
        {
          cargado &&
          <PracticalForm
          stepId={stepId} 
            teoricoid={teoricoid}
            teorico={teorico} />
        }
      </DialogContent>
      <DialogActions>
        <Button 
          autoFocus 
          onClick={handleClose} 
          color="primary">
          {
            "Accept"
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
