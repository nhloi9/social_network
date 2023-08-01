import {Button} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {follow, unfollow} from '../redux/actions/profileAction';

const FollowBtn = ({person}) => {
	const dispatch = useDispatch();
	const {loading_follow} = useSelector((state) => state.profile);
	const {user} = useSelector((state) => state.auth);
	const followHandle = () => {
		// setFollowed(true);
		dispatch(follow({user, other: person}));
	};
	const unfollowHandle = () => {
		setFollowed(false);
		dispatch(unfollow({user, other: person}));
	};
	const [followed, setFollowed] = useState(false);
	useEffect(() => {
		if (user?.following?.find((item) => item?._id === person?._id)) {
			setFollowed(true);
		} else setFollowed(false);
	}, [user?.following, person?._id]);

	return (
		<>
			{loading_follow === person?._id ? (
				<LoadingButton
					loading
					variant="contained"
					color="error"
					className={`h-[35px]  !cursor-pointer `}
					// onClick={unfollowHandle}
				>
					{/* Unfollow */}
				</LoadingButton>
			) : followed ? (
				<Button
					loading
					variant="contained"
					color="error"
					className={`h-[35px]  !cursor-pointer `}
					onClick={unfollowHandle}
				>
					Unfollow
				</Button>
			) : (
				<Button
					variant="contained"
					className={`h-[35px] !static !cursor-pointer`}
					onClick={followHandle}
				>
					Follow
				</Button>
			)}
		</>
	);
};

export default FollowBtn;
