import {GLOBALTYPES, addToArray, removeFromArray} from '../actions/globalTypes';
import {NOTIFY_TYPES} from '../actions/notifyAction';
import {POST_TYPES, receiveComment} from '../actions/postAction';

function spawnNotification(body, icon, title, url) {
	const notification = new Notification(title, {body, icon});
	notification.onclick = (e) => {
		e.preventDefault();
		window.open(url, '_blank');
	};
}

export const socketMiddleware = (socket) => (params) => (next) => (action) => {
	const {dispatch, getState} = params;
	const {type} = action;

	switch (type) {
		case 'socket/connect':
			socket.connect();
			socket.on('connect', () => {
				//join_post
				socket.emit(
					'join_post',
					getState().homePost.posts.map((post) => post._id)
				);

				//join user
				socket.emit('join_user', getState().auth.user._id);
			});

			//receive comment
			socket.on('comment', (comment) => {
				dispatch(receiveComment(comment));
			});

			//receive like post
			socket.on('like', (like) => {
				const post = getState().homePost.posts.find(
					(post) => post._id === like.post
				);
				dispatch({
					type: POST_TYPES.UPDATE_POST,
					payload: {...post, likes: [...post.likes, like]},
				});
			});

			//receive unlike post
			socket.on('unlike', (postId, userId) => {
				const post = getState().homePost.posts.find((post) => post._id === postId);
				dispatch({
					type: POST_TYPES.UPDATE_POST,
					payload: {
						...post,
						likes: post.likes.filter((like) => like.user._id !== userId),
					},
				});
			});

			//receive follow
			socket.on('follow', (sender) => {
				const user = getState().auth.user;
				dispatch({
					type: GLOBALTYPES.USER,
					payload: {...user, followers: addToArray(user.followers, sender)},
				});
			});

			//receive unfollow
			socket.on('unfollow', (senderId) => {
				const user = getState().auth.user;
				dispatch({
					type: GLOBALTYPES.USER,
					payload: {
						...user,
						followers: removeFromArray(user.followers, {_id: senderId}),
					},
				});
			});

			//receive notify
			socket.on('notify', (notify) => {
				spawnNotification(
					notify.content?.length > 20
						? notify.content.slice(0, 20) + '...'
						: notify.content,
					notify.sender.avatar,
					notify.sender.username + ' ' + notify.text,
					notify.url
				);
				dispatch({type: NOTIFY_TYPES.ADD, payload: notify});
				if (getState().notify.sound) {
					document.getElementById('notification_sound').play();
				}
			});

			//receive delete nofify by sender
			socket.on('deleteBySender', (notify) => {
				dispatch({type: NOTIFY_TYPES.DELETEBYSENDER, payload: notify});
			});

			//receive message
			socket.on('message', (message) => {
				console.log(message);
			});

			break;

		case 'socket/disconnect':
			socket.disconnect();
			break;

		default:
			break;
	}

	return next(action);
};
