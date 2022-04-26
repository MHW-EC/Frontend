
import React from 'react';
import StepsContext from './Context';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import CareerStep from './career';
import TheoryClassStep from './theoryClass';
import PracticalClassStep from './practicalClass';
import Schedule from './schedule/tableView';

class Steps extends React.Component {

  state = {
    steps: [
      {
        id: 0,
        name: 'career',
        label: 'Career',
        description: 'Type you career',
        error: undefined,
        data: undefined,
        selectedValues: undefined
      },
      {
        id: 1,
        name: 'theoryClass',
        label: 'Class',
        description: 'Type class name, class code or teacher name',//'Choose some theory classes',
        helperText: '* Hit Enter to search',
        error: undefined,
        data: undefined,
        selectedValues: undefined
      },
      {
        id: 2,
        name: 'practicalClass',
        label: 'Class parallel',
        description: 'Choose some practical classes',
        error: undefined,
        data: undefined,
        selectedValues: undefined
      },
      {
        id: 3,
        name: 'schedule',
        label: 'Schedule',
        description: 'Review your schedules',
        error: undefined,
        data: undefined,
        selectedValues: undefined
      }
    ],
    activeStepId: 0,
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
    if (this.isStepSkipped(this.state.activeStepId)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(this.state.activeStepId);
    }

    this.setState({
      activeStepId: this.state.activeStepId + 1,
      skipped: newSkipped
    });
  };

  handleBack = () => {
    this.setState({
      activeStepId: this.state.activeStepId - 1
    })
  };

  handleSkip = () => {
    if (!this.isStepOptional(this.state.activeStepId)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    const newSkipped = new Set(this.state.skipped.values());
    newSkipped.add(this.state.activeStepId);
    this.setState({
      activeStepId: this.state.activeStepId + 1,
      skipped: newSkipped
    });
  };

  handleReset = () => {
    this.setState({
      activeStepId: 0
    });
  };

  getComponentByStep = (stepId) => {
    switch (stepId) {
      case 0:
        return <CareerStep stepId={String(stepId)} />
      case 1:
        return <TheoryClassStep stepId={String(stepId)} lastStepId={String(stepId - 1)}/>
      case 2:
        return <PracticalClassStep stepId={String(stepId)} lastStepId={String(stepId - 1)}/>
      case 3:
        return <Schedule stepId={String(stepId)} lastStepId={String(stepId - 1)}/>
      default:
        return (<div>DEFAULT COMPONENT</div>)
    }
  }

  updateStep = (stepId, newStep, field) => {
    this.setState((currentState) => ({
      steps: currentState.steps.map(step => {
        if (step.id == stepId) {
          if(field &&
             newStep[field] ){
               const merged = Object.assign({}, step[field], newStep[field]);
            return {
              ...step,
              [field]: merged
            }
          }
          return {
            ...step,
            ...newStep
          }
        }
        return step;
      })
    }))
  }

  render() {

    const {
      process: {
        isLoading
      } = {}
    } = this.context;

    const {
      steps,
      activeStepId
    } = this.state;

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
console.log({steps});
    return (
      <StepsContext.Provider
        value={{
          updateStep,
          steps
        }}>
        <Box 
          sx={{
            width: 'auto',
            height: "100vh",
            pl: "16px",
            pr: "16px"
          }}>
          <Stepper 
            sx={{
              pt: "16px"
            }}
            activeStep={activeStepId}>
            {
              steps.map((step) => {
                const { id, label, error } = step
                const stepProps = {};
                const labelProps = {};

                if (isStepSkipped(id)) stepProps.completed = false;
                if (isStepOptional(id)) labelProps.optional = (<Typography variant="caption">Optional</Typography>);

                if (error) {
                  labelProps.error = error !== undefined;
                  labelProps.optional = (
                    <Typography variant="caption" color="error">
                      {error}
                    </Typography>
                  );
                }
                return (
                  <Step
                    key={String(id)}
                    {...stepProps}>
                    <StepLabel
                      {...labelProps}>
                      {
                        label
                      }
                    </StepLabel>
                  </Step>
                );
              })
            }
          </Stepper>
          {
            activeStepId === steps.length
              ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              )
              : (
                <React.Fragment>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      pt: '16px',
                      justifyContent: 'center'
                    }}>
                    <Button
                      color="info"
                      variant="contained"
                      disabled={activeStepId === 0}
                      onClick={handleBack}
                      sx={{ mr: 5 }}
                    >
                      Back
                    </Button>
                    <Button
                      disabled={!isStepOptional(activeStepId)}
                      variant="outlined"
                      onClick={handleSkip}
                      sx={{ mr: 1 }}>
                      Skip
                    </Button>
                    <Button
                      disabled={
                        isLoading || 
                        (!steps[activeStepId].selectedValues)
                      }
                      variant="contained"
                      onClick={handleNext}>
                      {
                        activeStepId === steps.length - 1 ? 'Finish' : 'Next'
                      }
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      pt: '16px',
                      pb: '16px'
                    }}>
                    {
                      getComponentByStep(activeStepId)
                    }    
                  </Box>
                </React.Fragment>
              )
          }
        </Box>
      </StepsContext.Provider>
    )
  }
}
// Steps.contextType = MainContext;
export default Steps;