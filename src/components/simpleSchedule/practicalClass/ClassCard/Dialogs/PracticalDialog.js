import React from 'react';
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog
} from '@mui/material';
import PracticalForm from './PracticalForm';

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
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle 
        id="confirmation-dialog-title">
        {'Select practical class'}
      </DialogTitle>
      <DialogContent 
        dividers 
        sx={{
          alignItems: 'center',
          padding: 0
        }}>
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
            'Accept'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};
