import React, {
	useContext, useEffect, useState,
	useMemo
} from 'react';
import {
	Checkbox,
	FormControlLabel,
	Skeleton,
	ListItemButton,
	List,
	ListItemIcon,
	ListItemText,
	Collapse,
	ListItem,
	Box,
	IconButton
} from '@mui/material';
import { getData } from '../../../services';
import { styled } from '@mui/material/styles';
// import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import TheoryClass from './TheoryClass';
import StepsContext from './../Context';

// import { useSelector, useDispatch } from 'react-redux';
// import { asociadosResults as asociadosSelector } from '../../../redux/selectors';
// import { getAsociados } from '../../../redux/actions/asociado';
// import { addPaquete, removePaquete } from '../../../redux/actions/paquetes';

const classes = {
	// root: {
	// 	width: '100%',
	// 	padding: 0,
	// },
	skeleton: {
		minHeight: "50px",
		justifyContent: "center",
		alignItems: "center",
		display: "flex"

	},
	subSkeleton: {
		marginLeft: "25%",
		marginRight: "auto",
	}
};
const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));
export default (props) => {
	const {
		teoricoid,
		stepId
		// teorico
	} = props;
	const { steps, updateStep } = useContext(StepsContext);
	const step = steps[Number(stepId)];
	const {
		selectedValues: stepSelectedValues = [],
		data: stepData = [],
		description: stepDescription
	} = step || {};
	const [localLoading, setLoading] = useState(false);
	const requestControler = useMemo(() => new AbortController(), []);
	const practicalClasses = stepData[teoricoid];
	const [collapsableState, setCollapsable] = useState({});

	// const [open, setOpen] = React.useState(true);

	// const handleClick = () => {
	// 	setOpen(!open);
	// };
	useEffect(() => {
		if (practicalClasses?.length) {
			setCollapsable(practicalClasses.reduce(
				(computed, current) => ({ ...computed, [current._id]: false }), {}));
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
						resourceName: "PracticalClass",
						query: "getByTheoryId",
						queryParams: {
							id: teoricoid
						}
					}, requestControler.signal);

					updateStep(
						stepId,
						{
							data: {
								// ...stepData,
								[teoricoid]: result
							},
							error: undefined
						},
						'data'
					)
				} catch (error) {
					updateStep(stepId, {
						// data: undefined,
						error: error instanceof Error
							? error.message
							: error
					})
				}
				setLoading(false);
			}
		})()
	}, []);

	// const handleChecking = (evento, teorico, practico) => {
	// 	let checked = evento.target.checked;
	// 	checked
	// 		? dispatch(addPaquete([teorico, practico], teoricoid, practico['_id']))
	// 		: dispatch(removePaquete(teoricoid, practico['_id']));
	// };

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
					<>
						<ListItem disablePadding>
							<Box sx={{
								display: "flex",
								width: "100%",
								padding: "8px",
								alignItems: "center"
							}}>
								<ListItemIcon>
								<IconButton children={<Checkbox
										color='primary'
									// onChange={(event) => handleChecking(event, teorico, par)}
									/>} />
									
								</ListItemIcon>
								<ListItemText primary={`Paralelo ${par['paralelo']}`} />
								<ListItemIcon sx={{ minWidth: 'unset' }}>
									<ExpandMore
										expand={collapsableState[par._id]}
										onClick={() => {
											setCollapsable(
												(currentState) => ({
													...currentState,
													[par._id]: !currentState[par._id]
												}
												)
											);
										}}
										aria-expanded={collapsableState[par._id]}
										aria-label="show more">
										<ExpandMoreOutlinedIcon />
									</ExpandMore>
								</ListItemIcon>
							</Box>
						</ListItem>
						<Collapse in={collapsableState[par._id]} timeout="auto" unmountOnExit>
							<Box sx={{ pl: "16px", pr: '16px', pt: '8px', pb: '8px' }}>
								<TheoryClass paralelo={par} parentComponent={"PracticalForm"} />
							</Box>
						</Collapse>
					</>
				))
				: [1, 2].map(_ => (
					<ListItem disablePadding>
						<ListItemButton >
							<ListItemIcon>
								<Checkbox
									color='primary'
								/>
							</ListItemIcon>
							<ListItemText
								primary={
									<Skeleton animation='wave' variant='text' width={"100px"} />
								} />
							<ListItemIcon sx={{ minWidth: 'unset' }}>
								<ExpandMoreOutlinedIcon />
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
				))}
	</List>
}
