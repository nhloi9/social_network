import React from 'react';
import UserCard from '../UserCard';
import FollowBtn from '../FollowBtn';
import {useSelector} from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

const Followers = ({users, setShowFollowers}) => {
	const {auth} = useSelector((state) => state);
	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 bg-[#00000032] flex justify-center items-center">
			<div className="bg-white w-[350px] h-[50vh] rounded-lg p-1 overflow-y-scroll">
				<div className="flex justify-end ">
					<CloseIcon
						className="cursor-pointer"
						onClick={() => {
							setShowFollowers(false);
						}}
					/>
				</div>
				{users.map((user) => (
					<UserCard user={user}>
						{user._id !== auth.user._id && <FollowBtn person={user} />}
					</UserCard>
				))}
			</div>
		</div>
	);
};

export default Followers;
