import React, {useEffect} from 'react';
import {Link, redirect, useLocation} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import TelegramIcon from '@mui/icons-material/Telegram';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {DownOutlined} from '@ant-design/icons';
import {Dropdown} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/actions/authAction';
import {GLOBALTYPES} from '../../redux/actions/globalTypes';
import Avatar from '../Avatar';
// import styles from '../../styles/styles';

const NavMenu = () => {
	// const navigate = useNavigate();
	const location = useLocation();
	const {theme} = useSelector((state) => state);
	const {user} = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	// let location = useLocation();
	const logoutHandle = () => {
		dispatch(logout());
	};
	const items = [
		{
			label: <Link to={`profile/${user._id}`}>Profile</Link>,
			key: '0',
		},
		{
			label: (
				<label
					className="cursor-pointer"
					// htmlFor="theme"
					onClick={() => {
						localStorage.setItem('theme', theme ? 'light' : 'dark');
						dispatch({type: GLOBALTYPES.THEME});
					}}
				>
					{!theme ? 'Dark mode' : 'Light mode'}
				</label>
			),
			key: '1',
		},

		{
			label: <div onClick={logoutHandle}>Logout</div>,
			key: '3',
		},
	];
	useEffect(() => {
		console.log('dispatch');
	}, [dispatch]);

	const navLinks = [
		{
			label: 'Home',
			icon: <HomeIcon fontSize="medium" />,
			path: '/',
		},
		{
			label: 'Message',
			icon: <TelegramIcon fontSize="medium" />,
			path: '/message',
		},
		{
			label: 'Discover',
			icon: <ExploreIcon fontSize="medium" />,
			path: '/discover',
		},
		{
			label: 'notification',
			icon: <FavoriteIcon fontSize="medium" />,
			path: '#',
		},
	];

	const isActive = (path) => {
		if (path === location.pathname) return true;
		return false;
	};
	// useEffect(() => {
	// 	console.log('click navigate');
	// 	// return () => {
	// 	// 	console.log('navigate');
	// 	// 	navigate('/');
	// 	// };
	// }, [navigate]);
	useEffect(() => {
		return () => {
			console.log(4);
			return redirect('/');
		};
	}, []);

	return (
		<div className="flex justify-between gap-5 items-center">
			{navLinks.map((navLink) => (
				<Link
					key={navLink.label}
					className={isActive(navLink.path) ? '' : 'opacity-60'}
					to={navLink.path}
				>
					{navLink.icon}
				</Link>
			))}
			<Dropdown
				placement="bottomRight"
				menu={{
					items,
					// onClick: onClick,
				}}
				trigger={['click']}
			>
				<div className="cursor-pointer flex gap-[3px] items-center">
					{/* <img
						src={user.avatar}
						alt=""
						className={`${
							theme ? 'invert' : 'invert-0'
						}  w-[20px] h-[20px] rounded-full object-cover`}
					/> */}
					<Avatar
						url={user.avatar}
						size={'small-avatar'}
					/>

					<DownOutlined className="text-[12px]" />
				</div>
			</Dropdown>
		</div>
	);
};

export default NavMenu;
