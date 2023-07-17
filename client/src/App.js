import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import {useDispatch, useSelector} from 'react-redux';
import Alert from './components/alert/Alert.jsx';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from 'react';
import {refresh_token} from './redux/actions/authAction';
import Header from './components/Header';
function App() {
	const dispatch = useDispatch();
	const {user} = useSelector((state) => state.auth);
	useEffect(() => {
		dispatch(refresh_token());
	}, [dispatch]);
	const {theme} = useSelector((state) => state);
	return (
		<div>
			<BrowserRouter>
				<Alert />
				{/* <input
					type="checkbox"
					id="theme"
					// hidden
				/> */}
				<div className={`${theme ? 'invert' : 'invert-0'} App`}>
					{user && <Header />}
					{/* <Header /> */}
					<Routes>
						<Route
							path="/"
							element={user ? <HomePage /> : <LoginPage />}
						></Route>

						<Route
							path="/register"
							element={<RegisterPage />}
						></Route>
						<Route
							path="*"
							element={<NotFoundPage />}
						/>
					</Routes>
				</div>
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</BrowserRouter>
		</div>
	);
}

export default App;
