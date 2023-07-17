import React from 'react';

const HomePage = () => {
	const a = new URLSearchParams(window.location.search).get('a');
	console.log(a);
	console.log('home page');
	return <div>HomePage</div>;
};

export default HomePage;
