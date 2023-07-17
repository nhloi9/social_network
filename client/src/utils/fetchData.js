import axios from 'axios';
import {store} from '../redux/store';
import {GLOBALTYPES} from '../redux/actions/globalTypes';

const client = axios.create({
	baseURL: 'http://localhost:4000/api/v2/',
	timeout: 3000, // 3 seconds
	withCredentials: true,
});

let previousState = store.getState();
store.subscribe(() => {
	const currentState = store.getState();
	if (currentState.auth.token !== previousState.auth.token) {
		client.defaults.headers.common.Authorization = currentState.auth.token;
	}
	previousState = {...currentState};
});

client.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 401 && originalRequest._retry !== true) {
			originalRequest._retry = true;
			// await axios.post()
			// can use axios to avoid infinite loop;

			try {
				const response = await client.post('/refresh_token');
				const {access_token} = response.data;
				// localStorage.setItem('access_token', access_token);
				store.dispatch({
					type: GLOBALTYPES.AUTH,
					payload: response.data,
				});
				originalRequest.headers.Authorization = access_token;
				return axios(originalRequest);
			} catch (refresh_error) {
				return Promise.reject(refresh_error);
			}
		}
		return Promise.reject(error);
	}
);

export const getDataApi = async (url, token) => {
	const response = await client.get(url, {
		headers: {
			Authorization: token,
		},
	});
	return response;
};

export const postDataAPI = async (url, data, token) => {
	// console.log(store.getState());
	const res = await client.post(url, data, {
		headers: {Authorization: token},
	});
	return res;
};
