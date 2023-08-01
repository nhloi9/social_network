import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../Avatar';
import {Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {validImage} from '../../utils/imageUpload';
import FollowBtn from '../FollowBtn';
import Followers from './Followers.jsx';
import Following from './Following.jsx';
import {
	PROFILE_TYPES,
	updateProfileUser,
} from '../../redux/actions/profileAction';
// import {getProfileUsers} from '../../redux/actions/profileAction';

const Info = ({id}) => {
	const {user} = useSelector((state) => state.auth);
	const {users} = useSelector((state) => state.profile);
	const [userData, setUserData] = useState(null);
	const [onEdit, setOnEdit] = useState(false);
	const [showFollowers, setShowFollowers] = useState(false);
	const [showFollowing, setShowFollowing] = useState(false);

	useEffect(() => {
		if (id === user?._id) {
			setUserData(user);
		} else {
			setUserData(users.find((user) => user?._id === id));
		}
	}, [id, user, users]);

	return (
		<div className="grid-cols-1 place-items-center mx-auto 800px:w-[80vw] max-w-[800px] grid 800px:grid-cols-3 gap-2 m-3 justify-between pr-5">
			{/* <p>&#128512;</p> */}
			<Avatar
				url={userData?.avatar}
				size={'large-avatar'}
			/>
			<div className=" text-gray-700 flex flex-col items-center 800px:block">
				<h1 className="text-[22px] font-[500]  text-black">{userData?.username}</h1>
				<div className="flex">
					<h1
						className=" cursor-pointer hover:underline "
						onClick={(e) => setShowFollowers(true)}
					>
						{userData?.followers?.length || 0} <span>followers</span>
					</h1>
					<h1
						className="ml-4  cursor-pointer hover:underline"
						onClick={() => {
							setShowFollowing(true);
						}}
					>
						{userData?.following?.length || 0} <span>following</span>
					</h1>
				</div>
				<h1 className="font-[500]">
					{userData?.fullname} - <span>{userData?.mobile}</span>
				</h1>

				<h1 className="font-[500]">{userData?.email}</h1>
				<h1 className="font-[500]">{userData?.address}</h1>
				<a
					href={user.website}
					target="_blank"
					rel="noreferrer"
					className="hover:underline text-blue-400"
				>
					{user.website}
				</a>
				<p>{userData?.story}</p>
			</div>
			{id === user._id ? (
				<Button
					variant="outlined"
					className={`h-[40px] ${
						id === user._id ? '' : '!hidden'
					}  !static !cursor-pointer`}
					onClick={() => {
						setOnEdit(true);
					}}
				>
					Edit profile
				</Button>
			) : (
				<FollowBtn person={userData} />
			)}
			{onEdit && (
				<EditProfile
					user={user}
					setOnEdit={setOnEdit}
				/>
			)}
			{showFollowers && (
				<Followers
					setShowFollowers={setShowFollowers}
					users={userData.followers}
					// user={user}
					// setOnEdit={setOnEdit}
				/>
			)}
			{showFollowing && (
				<Following
					setShowFollowing={setShowFollowing}
					users={userData.following}
					// user={user}
					// setOnEdit={setOnEdit}
				/>
			)}
		</div>
	);
};

const EditProfile = ({user, setOnEdit}) => {
	const dispatch = useDispatch();

	const initialState = {...user};
	const [userData, setUserData] = useState(initialState);
	const {fullname, mobile, address, website, story, gender} = userData;
	const [image, setImage] = useState(null);
	const handleChangeInput = (e) => {
		setUserData((pre) => ({...pre, [e.target.name]: e.target.value}));
	};
	const changeAvatar = (e) => {
		const file = e.target.files[0];
		const err = validImage(file);
		console.log({err});
		setImage(file);
	};
	const editProfileHandle = (e) => {
		e.preventDefault();
		dispatch(updateProfileUser({userData, image}));
	};
	const {success} = useSelector((state) => state.profile);
	useEffect(() => {
		if (success === 'edit successfully') {
			setOnEdit(false);
			dispatch({type: PROFILE_TYPES.CLEAR_SUCCESS});
		}
	}, [success, setOnEdit, dispatch]);
	return (
		<div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-[#0000003f] flex items-center justify-center">
			<div className="bg-white w-full h-[90vh] max-w-[500px] rounded-lg shadow-sm  overflow-y-scroll px-2 py-2 ">
				<div className="flex justify-end ">
					<CloseIcon
						className="cursor-pointer"
						onClick={() => {
							setOnEdit(false);
						}}
					/>
				</div>
				<div className="flex  w-full justify-center mt-6 mb-3 relative">
					<Avatar
						url={image ? URL.createObjectURL(image) : user.avatar}
						size={'large-avatar'}
					/>
					<label htmlFor="upload">
						<CameraAltIcon className="absolute bottom-[-2px] left-[50%] translate-x-4 cursor-pointer opacity-40 hover:opacity-[1]" />
						<input
							type="file"
							accept=" image/* "
							id="upload"
							hidden
							onChange={changeAvatar}
						/>
					</label>
				</div>
				<form
					action=""
					onSubmit={editProfileHandle}
					className="w-full  mb-[30px] px-2"
				>
					<div className="relative">
						<label htmlFor="fullname">Full Name</label>
						<input
							maxLength={25}
							name="fullname"
							id="fullname"
							required
							type="text"
							value={fullname}
							onChange={handleChangeInput}
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
						/>
						<span className="absolute top-9 right-1">{fullname?.length || 0}/25</span>
					</div>

					<div className="mt-4">
						<label htmlFor="mobile">Mobile</label>
						<input
							id="mobile"
							name="mobile"
							type="number"
							value={mobile}
							onChange={handleChangeInput}
							placeholder=""
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
						/>
						{/* <p className="text-[13px] text-red-500">{errEmail}</p> */}
					</div>
					<div className="mt-4">
						<label htmlFor="address">Address</label>
						<input
							id="address"
							name="address"
							type="text"
							value={address}
							onChange={handleChangeInput}
							placeholder=""
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
						/>
						{/* <p className="text-[13px] text-red-500">{errEmail}</p> */}
					</div>
					<div className="mt-4">
						<label htmlFor="website">Website</label>
						<input
							id="website"
							name="website"
							type="text"
							value={website}
							onChange={handleChangeInput}
							placeholder=""
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
						/>
						{/* <p className="text-[13px] text-red-500">{errEmail}</p> */}
					</div>
					<div className="mt-4 relative">
						<label htmlFor="story">Story</label>
						<textarea
							maxLength={256}
							name="story"
							value={story}
							rows={5}
							onChange={handleChangeInput}
							placeholder=""
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
						/>
						<span className="absolute top-9 right-1">{story?.length || 0}/256</span>

						{/* <p className="text-[13px] text-red-500">{errEmail}</p> */}
					</div>
					<div className="mt-4">
						<label htmlFor="gender">Gender</label>
						{/* <input
							id="mobile"
							name="mobile"
							required
							type="mobile"
							value={mobile}
							// onChange={handleChangeInput}
							placeholder=""
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
						/> */}

						<select
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
							name="gender"
							id=""
							value={gender}
							onChange={handleChangeInput}
						>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="other">Other</option>
						</select>
						{/* <p className="text-[13px] text-red-500">{errEmail}</p> */}
					</div>
					<Button
						type="submit"
						variant="outlined"
						className="w-full !mt-[30px] block !mb-2"
					>
						Save
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Info;
