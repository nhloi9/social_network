import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
function Protected({children}) {
	const {loading} = useSelector((state) => state.alert);
	const {token} = useSelector((state) => state.auth);
	if (!loading && !token) {
		return (
			<Navigate
				to="/"
				replace
			/>
		);
	}
	if (loading && !token) {
		return null;
	}
	return children;
}
export default Protected;
