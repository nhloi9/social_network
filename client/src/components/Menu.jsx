import React, {useEffect} from 'react';
import {
	Link,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import TelegramIcon from '@mui/icons-material/Telegram';
import ExploreIcon from '@mui/icons-material/Explore';
import {DownOutlined} from '@ant-design/icons';
import {Dropdown} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/actions/authAction';
import {GLOBALTYPES} from '../redux/actions/globalTypes';

// const onClick = ({key}) => {
// 	if (key == 0) {
// 		console.log(3);
// 	}
// };

const NavMenu = () => {
	// const navigate = useNavigate();
	// const location = useLocation();
	// const kdk = useParams();
	const [search] = useSearchParams();
	const {theme} = useSelector((state) => state);
	const {token, user} = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	// let location = useLocation();
	const logoutHandle = () => {
		dispatch(logout());
	};
	const items = [
		{
			label: (
				<div
					onClick={() => {
						// navigate('/?a=3');
					}}

					// to={'/?a=3'}
				>
					Profile
				</div>
			),
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
			icon: <HomeIcon />,
			path: '/',
		},
		{
			label: 'Message',
			icon: <TelegramIcon />,
			path: '/message',
		},
		{
			label: 'Discover',
			icon: <ExploreIcon />,
			path: '/discover',
		},
	];

	const isActive = (path) => {
		// if (path === location.pathname) return true;
		return false;
	};
	// useEffect(() => {
	// 	return () => {
	// 		console.log(5);
	// 		navigate('/');
	// 	};
	// }, []);
	// console.log(theme);

	// useEffect(() => {
	// 	console.log(4);
	// 	navigate('/');
	// }, [navigate]);
	console.log('menu');
	useEffect(() => {
		return () => {
			console.log('menu unmount');
		};
	}, []);
	return (
		<div className="flex justify-between gap-5 items-center">
			{navLinks.map((navLink) => (
				<Link
					// className={isActive(navLink.path) ? '' : 'opacity-60'}
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
					<img
						src={user.avatar}
						alt=""
						className={`${
							theme ? 'invert' : 'invert-0'
						}  w-[20px] h-[20px] rounded-full object-cover`}
					/>

					<DownOutlined className="text-[12px]" />
				</div>
			</Dropdown>
		</div>
	);
};

export default NavMenu;
