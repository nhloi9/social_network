export const validateRegister = ({email, password, fullName}) => {
	const err = {};
	if (!email) {
		err.email = 'Email is required';
	} else {
		console.log(email);
		if (!/^[\w.+-]+@gmail\.com$/.test(email))
			err.email = 'Please enter a valid gmail';
	}
	if (!password) {
		err.password = 'Password is required';
	} else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
		err.password =
			'Password must have minimum eight characters, at least one letter and one number ';
	}
	return err;
};
