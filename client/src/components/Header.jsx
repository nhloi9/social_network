import React from 'react';
import Menu from './Menu.jsx';

const Header = () => {
	console.log('header');
	return (
		<div className="w-[60vw]  mx-auto shadow-lg h-[70px] px-[20px] flex justify-between items-center bg-slate-100">
			<div>
				<h1 className="uppercase text-[22px] font-[700]">v-network</h1>
			</div>
			<Menu />
		</div>
	);
};

export default Header;
