import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const DashboardPage = () => {
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
	};
	return (
		
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
				Dashboard
			</h2>
		
			<div className='space-y-6'>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
					<p className='text-gray-300'>Name: {user.name}</p>
					<p className='text-gray-300'>Email: {user.email}</p>
				</motion.div>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
					<p className='text-gray-300'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300'>
						<span className='font-bold'>Last Login: </span>

						{formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>
						
			{/* <motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='mt-4'
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLogout}
					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Logout
				</motion.button>
			</motion.div> */}
		</motion.div>
	);
};
export default DashboardPage;


// import { motion } from "framer-motion";

// const DashboardPage = () => {
// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, scale: 0.9 }}
// 			animate={{ opacity: 1, scale: 1 }}
// 			exit={{ opacity: 0, scale: 0.9 }}
// 			transition={{ duration: 0.5 }}
// 			className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
// 		>
// 			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
// 				Trip Tales Dashboard
// 			</h2>

// 			<div className='space-y-6'>
// 				{/* Website Information */}
// 				<motion.div
// 					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.2 }}
// 				>
// 					<h3 className='text-xl font-semibold text-green-400 mb-3'>Website Information</h3>
// 					<p className='text-gray-300'><span className="font-bold">Name: </span>Trip Tales</p>
// 					<p className='text-gray-300'><span className="font-bold">Description: </span>A platform designed for travelers to share their adventures through videos, images, and detailed trip stories. Connect with fellow travelers, explore trending travel experiences, and share your journey with the community.</p>
// 				</motion.div>

// 				{/* Features Section */}
// 				<motion.div
// 					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.4 }}
// 				>
// 					<h3 className='text-xl font-semibold text-green-400 mb-3'>Features</h3>
// 					<ul className='text-gray-300 list-disc pl-5'>
// 						<li>Create and share travel blogs with images and videos</li>
// 						<li>Follow other travelers and send friend requests</li>
// 						<li>Real-time chat and video call functionality</li>
// 						<li>Curate playlists, like, comment, and save your favorite content</li>
// 						<li>Discover trending travel experiences</li>
// 					</ul>
// 				</motion.div>

// 				{/* Account Activity */}
// 				<motion.div
// 					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.6 }}
// 				>
// 					<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
// 					<p className='text-gray-300'>Enjoy browsing through the latest travel stories and connecting with like-minded travelers. Be part of our growing community!</p>
// 				</motion.div>
// 			</div>

// 			{/* Logout Button */}
// 			<motion.div
// 				initial={{ opacity: 0, y: 20 }}
// 				animate={{ opacity: 1, y: 0 }}
// 				transition={{ delay: 0.8 }}
// 				className='mt-4'
// 			>
// 				<motion.button
// 					whileHover={{ scale: 1.05 }}
// 					whileTap={{ scale: 0.95 }}
// 					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
// 				>
// 					Logout
// 				</motion.button>
// 			</motion.div>
// 		</motion.div>
// 	);
// };

// export default DashboardPage;
