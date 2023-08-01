export const GLOBALTYPES = {
	AUTH: 'AUTH',
	TOKEN: 'TOKEN',
	USER: 'USER',
	ALERT: 'ALERT',
	THEME: 'THEME',
	STATUS: 'STATUS',
	MODAL: 'MODAL',
	SOCKET: 'SOCKET',
	ONLINE: 'ONLINE',
	OFFLINE: 'OFFLINE',
	CALL: 'CALL',
	PEER: 'PEER',
};
export const addToArray = (arr, user) => {
	let newArr = [...arr];
	if (!newArr.find((item) => item._id === user._id)) {
		newArr.push(user);
	}
	return newArr;
};

export const removeFromArray = (arr, user) => {
	return arr.filter((item) => item._id !== user._id);
};
export const updateArray = (arr, user) => {
	return arr.map((item) => {
		if (item._id === user._id) return user;
		return item;
	});
};
