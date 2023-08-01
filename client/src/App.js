import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import RegisterPage from './pages/RegisterPage';
import MessagePage from './pages/MessagePage.jsx';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DiscoverPage from './pages/DiscoverPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import {useDispatch, useSelector} from 'react-redux';
import Alert from './components/alert/Alert.jsx';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from 'react';
import {refresh_token} from './redux/actions/authAction';
import Header from './components/header/Header';
import Protected from './router/Protected';
// import {Outlet} from 'react-router-dom';

function App() {
	const dispatch = useDispatch();
	const {token} = useSelector((state) => state.auth);
	useEffect(() => {
		dispatch(refresh_token());
	}, [dispatch]);

	const {theme} = useSelector((state) => state);
	console.log('app');
	// useEffect(() => {
	// 	Array.from(document.getElementsByTagName('img'))?.forEach((element) => {
	// 		if (theme) element.classList.add('invert');
	// 		else element.classList.add('invert-0');
	// 	});
	// 	Array.from(document.getElementsByTagName('video'))?.forEach((element) => {
	// 		if (theme) {
	// 			element.classList.add('invert');
	// 			console.log(3);
	// 		} else element.classList.add('invert-0');
	// 	});
	// }, []);
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
					{token && <Header />}
					{/* <Header /> */}
					<Routes>
						<Route
							path="/"
							element={token ? <HomePage /> : <LoginPage />}
						></Route>

						<Route
							path="/register"
							element={<RegisterPage />}
						></Route>
						<Route
							path="/message"
							element={
								<Protected>
									<MessagePage />
								</Protected>
							}
						></Route>
						<Route
							path="/discover"
							element={
								<Protected>
									<DiscoverPage />
								</Protected>
							}
						></Route>
						<Route
							path="profile/:id"
							element={
								<Protected>
									<ProfilePage />
								</Protected>
							}
						></Route>
						<Route
							path="*"
							element={<NotFoundPage />}
						/>
						<Route
							path="admin"
							// element={
							// 	<div>
							// 		admin
							// 		<Outlet />
							// 	</div>
							// }
						>
							<Route
								path="1"
								element={<div>1</div>}
							/>
						</Route>
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
