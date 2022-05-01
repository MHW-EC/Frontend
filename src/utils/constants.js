module.exports = {
  MESSAGES: {
    SUCCESSFUL_REQUEST: {
      message: "Successful request!",
      variant: "success",
      autoHideDuration: 2000,
    },
    FAILED_REQUEST: {
      message: "Failed request!",
      variant: "error",
      autoHideDuration: 2000,
    }
  },
  BOUNDARIES: {
    SUBJECT: {
      MIN: 2,
      MAX: 7
    },
    THEORY_CLASS: {
      MIN: 1,
      MAX: 3
    },
    PRACTICAL_CLASS: {
      MIN: 0,
      MAX: 3
    }
  }
};