import axios from 'axios';
export const validImage = (file) => {
	if (!file) return 'File does not exist';
	if (file.type !== 'image/jpeg' && file.type !== 'image/png')
		return 'Invalid file type';
	if (file.size > 1024 * 1024) return 'size of image must be less than  1 MB';
	return '';
};
export const upload = async (files) => {
	const url = 'https://api.cloudinary.com/v1_1/dgivfguja/auto/upload';
	const promises = [];

	files.forEach((file) => {
		const formdata = new FormData();
		formdata.append('file', file.url ? file.url : file);
		formdata.append('upload_preset', 'lxnys96r');
		// axios.post(url, formdata).then((response) => {
		// 	console.log(response.data.secure_url);
		// });
		promises.push(
			axios.post(url, formdata).then(
				(response) => response.data,
				(err) => {
					throw err;
				}
			)
		);
	});
	const images = await Promise.all(promises);
	return images;
};
