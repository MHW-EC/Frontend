
import React from 'react';
import StepsContext from './Context';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import CareerStep from './career';

class Steps extends React.Component {

  state = {
    steps: [
      {
        id: '0',
        name: 'career',
        label: 'Career',
        descriptiom: 'Select you carrer',
        error: undefined,
        data: undefined
      },
      {
        id: '1',
        name: 'theoryClass',
        label: 'Theory class',
        descriptiom: 'Select some theory classes',
        error: undefined,
        data: undefined
      },
      {
        id: '2',
        name: 'practicalClass',
        label: 'Practical class',
        descriptiom: 'Select some practical classes',
        error: undefined,
        data: undefined
      },
      {
        id: '3',
        name: 'schedule',
        label: 'Schedule',
        descriptiom: 'Review your schedules',
        error: undefined,
        data: undefined
      }
    ],
    activeStep: 0,
    skipped: new Set()
  }

  isStepOptional = (step) => {
    return step === 0;
  };

  isStepSkipped = (step) => {
    return this.state.skipped.has(step);
  };

  handleNext = () => {
    let newSkipped = this.state.skipped;
    if (this.isStepSkipped(this.state.activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(this.state.activeStep);
    }

    this.setState({
      activeStep: this.state.activeStep + 1,
      skipped: newSkipped
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    })
  };

  handleSkip = () => {
    if (!this.isStepOptional(this.state.activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    const newSkipped = new Set(this.state.skipped.values());
    newSkipped.add(this.state.activeStep);
    this.setState({
      activeStep: this.state.activeStep + 1,
      skipped: newSkipped
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  getComponentByStep = (step) => {
    switch(step){
      case 0:
        return <CareerStep stepId={String(step)} />
      default: 
        return (<div>DEFAULT COMPONENT</div>)
    }
  }

  updateStep = (stepId, newStep) => {
    this.setState({
      steps: this.state.steps.map(step => {
        if(step.id == stepId){
          return {
            ...step,
            ...newStep
          }
        }
        return step;
      })
    })
  }

  render() {

    const {
      steps,
      activeStep
    } = this.state;
    console.log({steps});
    const {
      isStepOptional,
      handleNext,
      handleBack,
      handleReset,
      handleSkip,
      getComponentByStep,
      isStepSkipped,
      updateStep
    } = this;

    return (
      <StepsContext.Provider
        value={{
          updateStep,
          steps
        }}>
        <Box m={6} mt={3} sx={{ width: 'auto' }}>
          <Stepper activeStep={activeStep}>
            {
              steps.map(({ id, label, error }, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (error) {
                  labelProps.error = error !== undefined;
                  labelProps.optional = (
                    <Typography variant="caption" color="error">
                      {error}
                    </Typography>
                  );
                }
                return (
                  <Step key={id} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {
                getComponentByStep(activeStep)
              }
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </StepsContext.Provider>
    )
  }

}

export default Steps;