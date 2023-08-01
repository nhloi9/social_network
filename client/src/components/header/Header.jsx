import React from 'react';
import Menu from './Menu.jsx';
import Search from './Search.jsx';
import './Header.css';

const Header = () => {
	return (
		<div className=" header sticky z-[1] top-0 left-0 right-0  w-full block 1100px:w-[80%]  mx-auto shadow-lg h-[90px] 800px:h-[70px] px-[20px] 800px:flex 800px:justify-between 800px:items-center bg-slate-100">
			<div className="hidden 800px:block">
				<h1 className="uppercase text-[22px] font-[700]">v-network</h1>
			</div>
			<div className="800px:w-[400px]">
				<Search />
			</div>
			<div>
				<Menu />
			</div>
		</div>
	);
};

export default Header;
