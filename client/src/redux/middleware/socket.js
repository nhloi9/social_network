import {CONVERSATION_TYPES} from '../actions/conversationAction';
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
				//update chat
				const chat = getState().conversation.chats.find(
					(item) => item._id === message.conversation
				);
				if (chat)
					dispatch({
						type: CONVERSATION_TYPES.UPDATE_CHAT,
						payload: {...chat, messages: [message, ...chat.messages]},
					});
				//update conversations
				const conversation = getState().conversation.conversations.find(
					(item) => item._id === message.conversation
				);
				const user = getState().auth.user;

				if (conversation) {
					const index = conversation.members.indexOf(
						conversation.members.find((member) => member._id === user._id)
					);
					dispatch({
						type: CONVERSATION_TYPES.UPDATE_CONVERSATION_SORT,
						payload: {
							...conversation,
							text: message.text,
							media: message.media || [],
							seen: index ? [true, false] : [false, true],
						},
					});
				} else {
					const newConversation = {
						_id: message.conversation,
						members: [message.sender, message.receiver],
						text: message.text,
						media: message.media,
						seen: [false, true],
					};
					dispatch({
						type: CONVERSATION_TYPES.ADD_CONVERSATION,
						payload: newConversation,
					});
				}
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
