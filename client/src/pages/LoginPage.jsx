import React, {useState} from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {Button} from '@mui/material';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {login} from '../redux/actions/authAction';

const LoginPage = () => {
	const [hidden, setHidden] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	// const {token} = useSelector((state) => state.auth);
	// const navigate = useNavigate();

	const loginHandele = (e) => {
		e.preventDefault();
		dispatch(login({email, password}));
	};
	// 	useEffect(()=>{
	// 	if(token){
	// navigate('/')
	// 	}
	// 	},[token])
	return (
		<div className="w-full h-[100vh] flex items-center justify-center">
			<div className="w-[400px] h-[60vh] border-gray-300 border px-[25px] py-[50px] bg-slate-100 rounded-sm shadow-2xl">
				<div className="flex justify-center mb-[30px] ">
					<h1 className="text-3xl font-[500]">Social Network</h1>
				</div>
				<form
					action=""
					onSubmit={loginHandele}
					className="w-full h-full"
				>
					<div>
						<label htmlFor="input-email ">Email Address</label>
						<input
							required
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="xyz@gmail.com"
							className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-sm focus:shadow-md "
						/>
						<span className="text-gray-400 text-[12px]">
							We'll never share your email with anyone else.
						</span>
					</div>
					<div className=" mt-4 ">
						<label htmlFor="input-password ">Password</label>
						<div className="relative">
							<input
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type={hidden ? 'password' : 'text'}
								className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-sm focus:shadow-md "
							/>
							{hidden ? (
								<VisibilityOffIcon
									className="absolute top-1 right-1 cursor-pointer  "
									onClick={() => setHidden(!hidden)}
									color="disabled"
								/>
							) : (
								<RemoveRedEyeIcon
									className="absolute top-1 right-1 cursor-pointer  "
									onClick={() => setHidden(!hidden)}
									color="disabled"
								/>
							)}
						</div>
					</div>
					<Button
						type="submit"
						variant="outlined"
						className="w-full !mt-[30px] block !mb-2"
					>
						Login
					</Button>
					<div className="flex">
						<h1>You don't have an acount?</h1>
						<Link
							to={'/register'}
							className="ml-2 block cursor-pointer text-blue-700"
						>
							Register now
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
