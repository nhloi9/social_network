import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Peer} from 'peerjs';
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
import {getPosts} from './redux/actions/postAction';
import DetailPostPage from './pages/DetailPostPage';
import {getSavePosts} from './redux/actions/saveAction';
import {socket} from './socket';
import {getNotifies} from './redux/actions/notifyAction';
import MessageDetailPage from './pages/MessageDetailPage';
import {getConversations} from './redux/actions/conversationAction';
import CallModal from './components/message/CallModal';
// import {Outlet} from 'react-router-dom';

function App() {
	const dispatch = useDispatch();
	const {token} = useSelector((state) => state.auth);
	const modal = useSelector((state) => state.modal);
	const {first} = useSelector((state) => state.homePost);
	const {call} = useSelector((state) => state);
	useEffect(() => {
		dispatch(refresh_token());
	}, [dispatch]);
	useEffect(() => {
		if (token && first) {
			dispatch(getPosts());
			dispatch(getSavePosts());
			dispatch({
				type: 'socket/connect',
			});
			dispatch(getNotifies());
			dispatch(getConversations());
			// const peer = new Peer(undefined, {
			// 	host: 'localhost',
			// 	port: 4000,
			// 	path: '/',
			// 	// secure: true,
			// });
			// window.peer = peer;
			// console.log(window.peer);
		}
	}, [dispatch, token, first]);
	useEffect(() => {
		socket.on('disconnect', () => {
			console.log('disconnect');
		});
	}, []);
	useEffect(() => {
		if (!('Notification' in window)) {
		} else {
			if (Notification.permission !== 'granted') {
				Notification.requestPermission();
			}
		}
	}, [dispatch]);

	// useEffect(() => {
	// 	if (token && first) {
	// 		// const socket = io('http://localhost:4000');
	// 		// socket.on('connect', () => {
	// 		// 	console.log('client', socket.id); // x8WIv7-mJelg7on_ALbx
	// 		// });
	// 		// socket.on('disconnect', (reason) => {
	// 		// 	console.log('client ger disconnectd', socket.id, 'because', reason);
	// 		// });
	// 	}
	// }, [dispatch, token, first]);

	// useEffect(() => {
	// 	const socket = io('http://localhost:4000');
	// 	console.log('app');
	// }, []);

	const {theme} = useSelector((state) => state);
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

	useEffect(() => {}, []);
	return (
		<div>
			<BrowserRouter>
				{/* <img
					className="block w-[100px] h-[100px] object-cover"
					src="http://123.30.235.196:5388/api/static/1dd55a4741c0939ecad1-wbl5..jpg"
					alt=""
				/> */}
				<Alert />
				{call && <CallModal call={call} />}
				{/* {token && <SocketClient />} */}
				{/* <input
					type="checkbox"
					id="theme"
					hidden
				/> */}
				<div
					className={` App ${theme ? 'invert' : ''} ${
						modal ? ' h-[100vh] overflow-hidden ' : ''
					}`}
				>
					{token && <Header />}
					{/* <div className=" fixed top-0 left-0 w-full h-[100vh] z-30 bg-black"></div> */}

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
							path="/message/:id"
							element={
								<Protected>
									<MessageDetailPage />
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
							path="post/:id"
							element={
								<Protected>
									<DetailPostPage />
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
