import React from 'react';
import {useSelector} from 'react-redux';

const Avatar = ({url, size}) => {
	const {theme} = useSelector((state) => state);
	return (
		<img
			src={url}
			alt=""
			className={`${
				theme ? 'invert' : 'invert-0'
			} ${size} rounded-full block static `}
		/>
	);
};

export default Avatar;
