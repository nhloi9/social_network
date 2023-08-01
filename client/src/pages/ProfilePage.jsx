import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Info from '../components/profile/Info.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileUsers} from '../redux/actions/profileAction.js';

const ProfilePage = () => {
	const {id} = useParams();
	const {user} = useSelector((state) => state.auth);
	// const [userData, setUserData] = useState(null);
	const dispatch = useDispatch();
	const {users} = useSelector((state) => state.profile);
	useEffect(() => {
		if (user._id !== id && !users.some((user) => user._id === id)) {
			dispatch(getProfileUsers({id}));
		}
	}, [dispatch, id, users, user]);

	return (
		<div>
			<Info id={id} />
		</div>
	);
};

export default ProfilePage;
