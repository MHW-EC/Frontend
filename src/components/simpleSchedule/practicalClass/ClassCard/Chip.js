import React from "react";
import { styled } from '@mui/material/styles';

import {
  Chip,
  Tooltip
} from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import BlockIcon from '@mui/icons-material/Block';

const topHexColor = "#D4AF37";
// const GoldChip = styled(Chip)`
//   .MuiChip-root {
//     color: ${topHexColor};
//     border-color: ${topHexColor};
//   }
//   .MuiChip-icon {
//     color: ${topHexColor};
//   }
// `;

export function getChip(valor, top) {
  if (top) {
    return <Tooltip title="Recommended teacher">
      <Chip
        variant="outlined"
        size="small"
        icon={<InsertEmoticonIcon />}
        label={valor}
      /></Tooltip>
  } else if (valor >= 80) {
    return <Tooltip title="Teacher score">
      <Chip
        sx={{
          root: {
            color: "green",
            borderColor: "green"
          },
          icon: {
            color: "green"
          }
        }}
        variant="outlined"
        size="small"
        icon={<InsertEmoticonIcon />}
        label={valor}
      />
    </Tooltip>
  } else if (valor < 80 && valor >= 70) {
    return <Tooltip title="Teacher score">
      <Chip
        sx={{
          root: {
            color: "orange",
            borderColor: "orange"
          },
          icon: {
            color: "orange"
          }
        }}
        variant="outlined"
        size="small"
        icon={<SentimentSatisfiedAltIcon />}
        label={valor}
      /></Tooltip>
  } else if (valor < 70 && valor > 0) {
    return <Tooltip title="Teacher score">
      <Chip
        sx={{
          root: {
            color: "red",
            borderColor: "red"
          },
          icon: {
            color: "red"
          }
        }}
        variant="outlined"
        size="small"
        icon={<SentimentVerySatisfiedIcon />}
        label={valor}
      /></Tooltip>
  } else {
    return <Tooltip title="Teacher score">
      <Chip
        sx={{
          root: {
            color: "gray",
            borderColor: "gray"
          }
        }}
        variant="outlined"
        size="small"
        icon={<BlockIcon />}
        label={"No data"}
      /></Tooltip>
  }
}