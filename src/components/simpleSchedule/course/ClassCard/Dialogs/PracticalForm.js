import React, {
  useContext, useEffect, useState,
  useMemo
} from 'react';
import {
  Skeleton,
  ListItemButton,
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListItem,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import { getData } from '../../../../../services';
import { styled } from '@mui/material/styles';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ClassCard from '..';
import StepsContext from '../../../Context';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

export default (props) => {
  const {
    teoricoid,
    stepId
  } = props;
  const { steps, updateStep } = useContext(StepsContext);
  const step = steps[Number(stepId)];
  const {
    data: stepData = []
  } = step || {};
  const [localLoading, setLoading] = useState(false);
  const requestControler = useMemo(() => new AbortController(), []);
  const practicalClasses = stepData[teoricoid];
  const [collapsableState, setCollapsable] = useState({});

  useEffect(() => {
    if (practicalClasses?.length) {
      setCollapsable(practicalClasses.reduce(
        (computed, current) => ({ ...computed,
          [current._id]: false }), {}));
    }
  }, [practicalClasses]);

  useEffect(() => {
    return () => requestControler.abort();
  }, [requestControler]);

  useEffect(() => {
    (async () => {
      if (!practicalClasses) {
        try {
          setLoading(true);

          const result = await getData({
            resourceName: 'PracticalClass',
            query: 'getByTheoryId',
            queryParams: {
              id: teoricoid
            }
          }, requestControler.signal);

          updateStep(
            stepId,
            {
              data: {
                [teoricoid]: result
              },
              error: undefined
            },
            'data'
          );
        } catch (error) {
          console.log(error);
          updateStep(stepId, {
            error: error instanceof Error
              ? error.message
              : error
          });
        }
        setLoading(false);
      }
    })();
  }, []);

  return <List
    sx={{
      padding: '0px',
      bgcolor: 'background.paper'
    }}
    component="nav"
    aria-labelledby="nested-list-subheader">
    {
      !localLoading &&
				practicalClasses &&
				practicalClasses.length ?
        practicalClasses.map((par) => (
          <React.Fragment key={par._id}>
            <ListItem>
              <ListItemButton sx={{
                display: 'flex',
                width: '100%',
                padding: '8px',
                alignItems: 'center'
              }}
              onClick={() => {
                setCollapsable(
                  (currentState) => ({
                    ...currentState,
                    [par._id]: !currentState[par._id]
                  }
                  )
                );
              }}>
                <ListItemText children={<Typography>{`Paralelo ${par['paralelo']}`}</Typography>} />
                <ExpandMore
                    expand={collapsableState[par._id]}
                    aria-expanded={collapsableState[par._id]}
                    aria-label="show more">
                    <ExpandMoreOutlinedIcon />
                  </ExpandMore>
              </ListItemButton>
            </ListItem>
            <Collapse in={collapsableState[par._id]} timeout="auto" unmountOnExit>
              <Box sx={{ pl: '16px',
                pr: '16px',
                pt: '8px',
                pb: '8px' }}>
                <ClassCard 
                  paralelo={par} 
                  parentComponent={'PracticalForm'}
                  top={false}
                  stepId={stepId} />
              </Box>
            </Collapse>
          </React.Fragment>
        ))
        : [1, 2].map((_, idx) => (
          <ListItem key={`t-2-${idx}`}>
            <ListItemIcon sx={{
              display: 'flex',
              width: '100%',
              padding: '8px',
              alignItems: 'center'
            }}>
              <ListItemButton >
                <ListItemText
                  primary={
                    <Skeleton animation='wave' variant='text' width={'100px'} />
                  } />
                <ListItemIcon sx={{ minWidth: 'unset' }}>
                  <ExpandMoreOutlinedIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItemIcon>
          </ListItem>
        ))}
  </List>;
};
