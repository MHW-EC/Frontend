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
	ListItem
} from '@mui/material';
import { getData } from '../../../services'; 
// import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import TheoryClass from './TheoryClass';
import StepsContext from './../Context';

// import { useSelector, useDispatch } from 'react-redux';
// import { asociadosResults as asociadosSelector } from '../../../redux/selectors';
// import { getAsociados } from '../../../redux/actions/asociado';
// import { addPaquete, removePaquete } from '../../../redux/actions/paquetes';

const classes = {
	root: {
		width: '100%',
		padding: 0,
	},
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

	// const [open, setOpen] = React.useState(true);

	// const handleClick = () => {
	// 	setOpen(!open);
	// };
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
								...stepData,
								[teoricoid]: result
							},
							error: undefined
						}
					)
				} catch (error) {
					updateStep(stepId, {
						data: undefined,
						error: error instanceof Error
							? error.message
							: error
					})
				}
				setLoading(false);
			}
		})()
	}, []);

	// const dispatch = useDispatch();
	// const parAsociados = useSelector((state, codigo) =>
	// 	asociadosSelector(state, teoricoid)
	// );

	// useEffect(() => {
	// 	if (!parAsociados) {
	// 		dispatch(getAsociados(teoricoid));
	// 	}
	// });

	// const handleChecking = (evento, teorico, practico) => {
	// 	let checked = evento.target.checked;
	// 	checked
	// 		? dispatch(addPaquete([teorico, practico], teoricoid, practico['_id']))
	// 		: dispatch(removePaquete(teoricoid, practico['_id']));
	// };

	return <div className={classes.root}>
		<List
			sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
			component="nav"
			aria-labelledby="nested-list-subheader">
			{
				!localLoading && 
				practicalClasses &&
				practicalClasses.length ?
					practicalClasses.map((par) => (
						<>
							<ListItemButton >
								<ListItemIcon>
									<ExpandMoreOutlinedIcon />
								</ListItemIcon>
								<FormControlLabel
									aria-label='Acknowledge'
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
									control={
										<Checkbox
											color='primary'
										// onChange={(event) => handleChecking(event, teorico, par)}
										/>
									}
									label={`Paralelo ${par['paralelo']}`}
								/>
								<ListItemText primary="Inbox" />
								{<ExpandMore />}
							</ListItemButton>
							<Collapse in={true} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									<ListItem sx={{ pl: 4 }}>
										<TheoryClass paralelo={par} />
									</ListItem>
								</List>
							</Collapse>
						</>
					))
					: [1, 2, 3].map(_ => (
						<>
							<ListItemButton>
								<ListItemIcon>
									<ExpandMoreOutlinedIcon />
								</ListItemIcon>
								<FormControlLabel
									aria-label='Acknowledge'
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
									control={
										<Checkbox
											color='primary'
										// onChange={(event) => handleChecking(event, teorico, par)}
										/>
									}
									label={<Skeleton animation='wave' variant='text' width={100} />}
								/>
								<ListItemText primary="Inbox" />
								{<ExpandMore />}
							</ListItemButton>
						</>
					))}
		</List>
	</div>
}
