import React from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';

const DiscoverPage = () => {
	let [searchParams] = useSearchParams();

	const data = searchParams.get('data');
	const {state} = useLocation();
	console.log({state, data});
	return <div>DiscoverPage</div>;
};

export default DiscoverPage;
