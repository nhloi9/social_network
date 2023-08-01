import React, {useRef, useState} from 'react';
import Avatar from '../Avatar';
import {useSelector} from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import EmojiPicker from 'emoji-picker-react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {Button} from 'antd';
import {toast} from 'react-toastify';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

const Status = () => {
	const [onCreatePost, setOnCreatePost] = useState(false);
	const {user} = useSelector((state) => state.auth);
	return (
		<div className="w-full flex justify-center ">
			<div className="w-[70%] max-w-[600px] shadow-stone-400 shadow-sm h-[80px] p-4 rounded-md flex items-center  justify-between gap-2">
				<Avatar
					url={user?.avatar}
					size={'big-avatar'}
				/>
				<input
					type="text"
					className="block w-full h-[50px] outline-none bg-gray-100 rounded-[20px] pl-3 cursor-pointer hover:bg-gray-200"
					placeholder={`${user?.fullname} ơi, bạn đang nghĩ gì thế ?`}
					// disabled
					onClick={() => {
						setOnCreatePost(true);
						// console.log(object);
					}}
				/>
				{onCreatePost && (
					<CreatePost
						setOnCreatePost={setOnCreatePost}
						user={user}
					/>
				)}
			</div>
		</div>
	);
};
const CreatePost = ({setOnCreatePost, user}) => {
	const [openCamera, setOpenCamera] = useState(false);
	const [openPicker, setOpenPicker] = useState(false);
	const textareRef = useRef(null);
	const [images, setImages] = useState([]);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const handleSelectEmoji = (emoji) => {
		console.log(emoji.emoji);
		console.log(emoji);
		console.log(textareRef.current.selectionStart);
		const textarea = textareRef.current;
		const startPosition = textarea.selectionStart;
		const endPosition = textarea.selectionEnd;
		const currentContent = textarea.value;
		const newContent =
			currentContent.substring(0, startPosition) +
			emoji.emoji +
			currentContent.substring(endPosition);
		textareRef.current.value = newContent;
		textareRef.current.focus();
		textareRef.current.setSelectionRange(
			startPosition + emoji.emoji.length,
			startPosition + emoji.emoji.length
		);
	};
	function dataURLtoFile(dataURL, filename) {
		const arr = dataURL.split(',');
		const mimeMatch = arr[0].match(/:(.*?);/);
		const mime = mimeMatch && mimeMatch.length >= 2 ? mimeMatch[1] : 'image/png';

		const byteString = atob(arr[1]);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const uint8Array = new Uint8Array(arrayBuffer);

		for (let i = 0; i < byteString.length; i++) {
			uint8Array[i] = byteString.charCodeAt(i);
		}

		const blob = new Blob([arrayBuffer], {type: mime});
		return new File([blob], filename, {type: mime});
	}
	const handeSelectPhoto = (e) => {
		let imagesArr = [...images, ...Array.from(e.target.files)];
		console.log(e.target.files[0]);
		if (imagesArr.length > 6) {
			imagesArr.splice(6);
			toast.error('Select too many images');
		}
		setImages(imagesArr);
	};
	const handleOpenFrontCamera = (e) => {
		setOpenCamera(true);
		navigator.mediaDevices
			.getUserMedia({video: {facingMode: 'user', audio: true}})
			.then((mediaStream) =>
				// console.log({mediaStream, a: mediaStream.getVideoTracks()})
				{
					videoRef.current.srcObject = mediaStream;
					videoRef.current.play();
					// videoRef.current.style.height = '300px';
					videoRef.current.setAttribute(
						'width',
						// mediaStream.getVideoTracks()[0].getSettings().aspectRatio * 400 + 'px'
						'390px'
					);
					console.log();
				}
			)
			.catch((err) => {
				toast.error(err);
			});
	};
	const handleOpenBackCamera = (e) => {
		setOpenCamera(true);
		navigator.mediaDevices
			.getUserMedia({video: {facingMode: {exact: 'environment'}}})
			.then((mediaStream) =>
				// console.log({mediaStream, a: mediaStream.getVideoTracks()})
				{
					videoRef.current.srcObject = mediaStream;
					videoRef.current.play();
					// videoRef.current.style.height = '300px';
					videoRef.current.setAttribute(
						'width',
						// mediaStream.getVideoTracks()[0].getSettings().aspectRatio * 400 + 'px'
						'390px'
					);
					console.log();
				}
			)
			.catch((err) => {
				console.log(err);
				toast.error(err);
			});
	};
	const captureImage = () => {
		const canvas = canvasRef.current;

		const context = canvas.getContext('2d');
		canvas.width = 390;
		canvas.height = 390 / 1.33333;
		context.drawImage(videoRef.current, 0, 0, 390, 390 / 1.333);

		const data = canvas.toDataURL('image/png');
		const file = dataURLtoFile(data, 'my_image.png');
		// dataURLtoArrayBuffer()
		let imagesArr = [...images, file];
		if (imagesArr.length > 6) {
			imagesArr.splice(6);
			toast.error('Select too many images');
		}
		setImages(imagesArr);
	};
	return (
		<div
			className=" status fixed top-0 z-50 right-0 w-[100vw] h-[100vh] bg-[#00000048] flex justify-center items-center "
			onClick={() => setOpenPicker(false)}
		>
			<div className="create-post w-[450px] h-min max-h-[95vh] overflow-y-scroll bg-white rounded-md  px-5 py-3 relative">
				<div className="flex justify-between items-center  pb-2 ">
					<h1 className=" text-[18px] font-[500] select-none">Create post</h1>
					<CloseIcon
						className="cursor-pointer"
						onClick={() => {
							setOnCreatePost(false);
							setOpenCamera(false);
							videoRef?.current?.srcObject
								?.getTracks()
								?.forEach((track) => track.stop());
						}}
					/>
				</div>
				<hr />
				<textarea
					ref={textareRef}
					name=""
					id=""
					cols="49"
					rows="6"
					className="pt-2 outline-none appearance-none resize-none"
					placeholder={`${user?.fullname} ơi, bạn đang nghĩ gì thế ?`}
					maxLength={200}
				></textarea>
				<div className="flex justify-end">
					<p
						className="cursor-pointer opacity-50 select-none"
						onClick={(e) => {
							e.stopPropagation();

							setOpenPicker(!openPicker);
							textareRef.current.focus();
						}}
					>
						&#128512;
						{/* jdjkd */}
					</p>
				</div>
				{openPicker && (
					<div
						className="absolute z-50 right-6"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						{/* can use emoji mart */}
						<EmojiPicker
							autoFocusSearch={false}
							onEmojiClick={handleSelectEmoji}
							height="400px"
						/>
					</div>
				)}
				{images && (
					<div className="flex pt-2 flex-wrap gap-1">
						{images.map((image, i) => {
							return (
								<div
									key={i}
									className="h-[100px] w-[130px] border border-blue-300 p-1 relative"
								>
									<CloseIcon
										fontSize="medium"
										className="absolute top-0 right-0 text-red-400 cursor-pointer"
										onClick={() => {
											const copy = [...images];
											copy.splice(i, 1);
											setImages(copy);
										}}
									/>
									<img
										src={URL.createObjectURL(image)}
										alt=""
										className="block w-full h-full object-contain"
									/>
								</div>
							);
						})}
					</div>
				)}
				<br />

				{openCamera && (
					<div className="relative h-min flex justify-center py-2 border border-blue-400 mb-2">
						<video
							ref={videoRef}
							src=""
						></video>
						<CloseIcon
							fontSize="large"
							className="absolute top-2 right-2  text-red-400 cursor-pointer"
							onClick={() => {
								setOpenCamera(false);
								console.log(videoRef.current.srcObject);
								videoRef?.current?.srcObject
									?.getTracks()
									?.forEach((track) => track.stop());
							}}
						/>
						<ChangeCircleIcon
							fontSize="large"
							className="absolute bottom-3 right-3 text-red-400 cursor-pointer"
							onClick={handleOpenBackCamera}
						/>
						<canvas
							className=" hidden w-[300px] h-[300px]"
							ref={canvasRef}
						></canvas>
					</div>
				)}
				{openCamera ? (
					<div className="flex justify-center gap-3 ">
						<AddAPhotoIcon
							sx={{fontSize: '32px'}}
							className="cursor-pointer"
							onClick={captureImage}
						/>
					</div>
				) : (
					<div className="flex justify-center gap-3">
						<AddAPhotoIcon
							sx={{fontSize: '32px'}}
							className="cursor-pointer"
							onClick={handleOpenFrontCamera}
						/>
						<label htmlFor="select-photo">
							<AddPhotoAlternateIcon
								fontSize="large"
								className="cursor-pointer"
							/>
							<input
								className="hidden"
								type="file"
								id="select-photo"
								multiple
								onChange={handeSelectPhoto}
								accept="image/*"
							/>
						</label>
					</div>
				)}
				<Button
					type="dashed"
					className="w-full !my-[10px] !font-[400]"
				>
					Post
				</Button>
			</div>
		</div>
	);
};

export default Status;
