import React from 'react';
//import ImageList from '@mui/material/ImageList';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

const getCols = (ancho) => {
  switch (ancho) {
  case 'xs':
    return 1;
  case 'sm':
    return 1.3;
  case 'md':
    return 1.5;
  case 'lg':
    return 2;
  case 'xl':
    return 2.5;
  default:
    return 1;
  }
};

export default function UseWidth(props) {
  const width = useWidth();
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <div
        sx={{
          height: 'auto',
          padding: 10,
          spacing: 10, 
          whiteSpace: 'nowrap',
          overflow: 'auto'
        }}
        cols={getCols(width)}
        children={props.children} />
    </ThemeProvider>
  );
}