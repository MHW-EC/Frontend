import React from 'react';
import StepsContext from './Context';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CareerStep from './career';
import SubjectStep from './subject';
import CourseStep from './course';
import Schedule from './schedule/tableView';
import { withSnackbar } from 'notistack';
import VALIDATIONS from './../../utils/validations';
import { BOUNDARIES } from './../../utils/constants';
import GoogleAd from './../ads';

class Steps extends React.Component {
  state = {
    steps: [
      {
        id: 0,
        name: 'career',
        label: 'Career',
        description: 'Type you career',
        helperText: '* Select a career to get all your subjects quickly',
        error: undefined,
        data: undefined,
        selectedValues: undefined,
      },
      {
        id: 1,
        name: 'subject',
        label: 'Subject',
        description: 'Type subject name, subject code or teacher name', //'Choose some theory classes',
        helperText: '* Hit Enter to search',
        error: undefined,
        data: undefined,
        selectedValues: undefined,
      },
      {
        id: 2,
        name: 'courses',
        label: 'Courses',
        helperText:
          '* Select theorical and practical classes (if this is the case)',
        error: undefined,
        data: undefined,
        selectedValues: undefined,
      },
      {
        id: 3,
        name: 'schedule',
        label: 'Schedule',
        description: 'Review your schedules',
        helperText: '* Not all options have all selected classes',
        error: undefined,
        data: undefined,
        selectedValues: undefined,
      },
    ],
    activeStepId: 0,
    skipped: new Set(),
  };

  isStepOptional = (step) => {
    return step === 0;
  };

  isStepSkipped = (step) => {
    return this.state.skipped.has(step);
  };

  shouldContinue = () => {
    const { steps, activeStepId } = this.state;
    const { enqueueSnackbar } = this.props;
    const activeStepData = steps[activeStepId];
    const { selectedValues } = activeStepData;
    switch (activeStepId) {
      case 1:
        if (selectedValues.length < BOUNDARIES.SUBJECT.MIN) {
          const { message, ...otherOptions } =
            VALIDATIONS.STEPS.MIN_SUBJECTS_NO_REACHED;
          enqueueSnackbar(message, otherOptions);
          return false;
        }
        if (selectedValues.length > BOUNDARIES.SUBJECT.MAX) {
          const { message, ...otherOptions } =
            VALIDATIONS.STEPS.MAX_SUBJECTS_REACHED;
          enqueueSnackbar(message, otherOptions);
          return false;
        }
      case 2:
        if (
          Object.values(selectedValues).every(
            (val) => Object.keys(val).length < BOUNDARIES.THEORY_CLASS.MIN
          )
        ) {
          const { message, ...otherOptions } =
            VALIDATIONS.STEPS.MIN_CLASSES_NO_REACHED;
          enqueueSnackbar(message, otherOptions);
          return false;
        }
        if (
          Object.values(selectedValues).some(
            (val) => Object.keys(val).length > BOUNDARIES.THEORY_CLASS.MAX
          )
        ) {
          const { message, ...otherOptions } =
            VALIDATIONS.STEPS.MAX_CLASSES_REACHED;
          enqueueSnackbar(message, otherOptions);
          return false;
        }
        if (
          Object.values(selectedValues).every(
            (val) =>
              Object.values(val).reduce(
                (total, current) => total + current,
                0
              ) < BOUNDARIES.PRACTICAL_CLASS.MIN
          )
        ) {
          const { message, ...otherOptions } =
            VALIDATIONS.STEPS.MIN_COURSES_NO_REACHED;
          enqueueSnackbar(message, otherOptions);
          return false;
        }
        if (
          Object.values(selectedValues).some(
            (val) =>
              Object.values(val).reduce(
                (total, current) => total + current,
                0
              ) > BOUNDARIES.PRACTICAL_CLASS.MAX
          )
        ) {
          const { message, ...otherOptions } =
            VALIDATIONS.STEPS.MAX_COURSES_REACHED;
          enqueueSnackbar(message, otherOptions);
          return false;
        }
      default:
        return true;
    }
  };

  handleNext = () => {
    let newSkipped = this.state.skipped;
    if (this.isStepSkipped(this.state.activeStepId)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(this.state.activeStepId);
    }
    const shouldContinue = this.shouldContinue();
    if (shouldContinue) {
      this.setState({
        activeStepId: this.state.activeStepId + 1,
        skipped: newSkipped,
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStepId: this.state.activeStepId - 1,
    });
  };

  handleSkip = () => {
    if (!this.isStepOptional(this.state.activeStepId)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    const newSkipped = new Set(this.state.skipped.values());
    newSkipped.add(this.state.activeStepId);
    this.setState({
      activeStepId: this.state.activeStepId + 1,
      skipped: newSkipped,
    });
  };

  handleReset = () => {
    this.setState({
      activeStepId: 0,
    });
  };

  getComponentByStep = (stepId) => {
    switch (stepId) {
      case 0:
        return <CareerStep stepId={'0'} />;
      case 1:
        return <SubjectStep stepId={'1'} lastStepId={'0'} />;
      case 2:
        return <CourseStep stepId={'2'} lastStepId={'1'} />;
      case 3:
        return <Schedule stepId={'3'} lastStepId={'2'} />;
      default:
        return <div>DEFAULT COMPONENT</div>;
    }
  };

  updateStep = (stepId, newStep, field) => {
    this.setState((currentState) => ({
      steps: currentState.steps.map((step) => {
        if (step.id === Number(stepId)) {
          if (field && newStep[field]) {
            const merged = Object.assign({}, step[field], newStep[field]);
            return {
              ...step,
              [field]: merged,
            };
          }
          return {
            ...step,
            ...newStep,
          };
        }
        return step;
      }),
    }));
  };

  render() {
    const { process: { isLoading } = {} } = this.context;

    const { steps, activeStepId } = this.state;
    const {
      isStepOptional,
      handleNext,
      handleBack,
      handleReset,
      handleSkip,
      getComponentByStep,
      isStepSkipped,
      updateStep,
      props,
    } = this;

    const { enqueueSnackbar } = props;

    return (
      <StepsContext.Provider
        value={{
          updateStep,
          steps,
          enqueueSnackbar,
        }}
      >
        <div style={{ height: '100vh' }}>
          <Grid
            style={{ height: '100%' }}
            sx={{ width: '100vw', height: '100vh' }}
            container
            direction="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item sx={{ width: '100vw' }}>
              <Stepper
                sx={{
                  pt: '16px',
                }}
                activeStep={activeStepId}
              >
                {steps.map((step) => {
                  const { id, label, error } = step;
                  const stepProps = {};
                  const labelProps = {};

                  if (isStepSkipped(id)) stepProps.completed = false;
                  if (isStepOptional(id))
                    labelProps.optional = (
                      <Typography variant="caption">Optional</Typography>
                    );

                  if (error) {
                    labelProps.error = error !== undefined;
                    labelProps.optional = (
                      <Typography variant="caption" color="error">
                        {error}
                      </Typography>
                    );
                  }
                  return (
                    <Step key={String(id)} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStepId === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    {'All steps completed - you&apos;re finished'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>{'Reset'}</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      pt: '16px',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      color="secondary"
                      variant="contained"
                      disabled={activeStepId === 0}
                      onClick={handleBack}
                      sx={{ mr: 5 }}
                    >
                      {'Back'}
                    </Button>
                    <Button
                      disabled={!isStepOptional(activeStepId)}
                      variant="outlined"
                      onClick={handleSkip}
                      sx={{ mr: 1 }}
                    >
                      {'Skip'}
                    </Button>
                    <Button
                      disabled={
                        isLoading || !steps[activeStepId].selectedValues
                      }
                      variant="contained"
                      onClick={handleNext}
                    >
                      {activeStepId === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      pt: '16px',
                      pb: '16px',
                    }}
                  >
                    {getComponentByStep(activeStepId)}
                  </Box>
                </React.Fragment>
              )}
            </Grid>
            <Grid item>
              <GoogleAd
                position="bottom"
                adFormat="auto"
                responsive={true}
                adSlot="6079638243"
                style={{ display: 'block' }}
              />
            </Grid>
          </Grid>
        </div>
      </StepsContext.Provider>
    );
  }
}

export default withSnackbar(Steps);
