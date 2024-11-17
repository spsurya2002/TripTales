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
      className='max-w-4xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
    >
      {/* Header Section with Logout Button */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
          Dashboard
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className='py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
        >
          Logout
        </motion.button>
      </div>

      {/* Content Section */}
      <div className='space-y-6'>
        {/* Profile Information */}
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

        {/* Account Activity */}
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

        {/* About Trip Tales Section */}
        <motion.div
          className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className='text-xl font-semibold text-green-400 mb-3'>About Trip Tales</h3>
          <p className='text-gray-300'>
            <strong>Trip Tales</strong> is a dynamic platform designed for travelers to share their journeys through videos, photos, and blogs. 
            It allows adventurers to connect, engage, and inspire through their stories.
          </p>
          <p className='text-gray-300 mt-2'>
            Users can create personalized travel profiles, upload content, and engage with others via likes, comments, and even real-time chats and video calls.
            The platform aims to create a vibrant community for travel enthusiasts to explore new destinations and connect with like-minded explorers.
          </p>
          <p className='text-gray-300 mt-2'>
            With features like custom playlists, trending content, and seamless media management, Trip Tales is the ultimate companion for those passionate about 
            discovering the world and sharing their experiences.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;









// import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";
// import { formatDate } from "../utils/date";

// const DashboardPage = () => {
// 	const { user, logout } = useAuthStore();

// 	const handleLogout = () => {
// 		logout();
// 	};
// 	return (
		
// 		<motion.div
// 			initial={{ opacity: 0, scale: 0.9 }}
// 			animate={{ opacity: 1, scale: 1 }}
// 			exit={{ opacity: 0, scale: 0.9 }}
// 			transition={{ duration: 0.5 }}
// 			className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
// 		>
// 			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
// 				Dashboard
// 			</h2>
		
// 			<div className='space-y-6'>
// 				<motion.div
// 					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.2 }}
// 				>
// 					<h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
// 					<p className='text-gray-300'>Name: {user.name}</p>
// 					<p className='text-gray-300'>Email: {user.email}</p>
// 				</motion.div>
// 				<motion.div
// 					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.4 }}
// 				>
// 					<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
// 					<p className='text-gray-300'>
// 						<span className='font-bold'>Joined: </span>
// 						{new Date(user.createdAt).toLocaleDateString("en-US", {
// 							year: "numeric",
// 							month: "long",
// 							day: "numeric",
// 						})}
// 					</p>
// 					<p className='text-gray-300'>
// 						<span className='font-bold'>Last Login: </span>

// 						{formatDate(user.lastLogin)}
// 					</p>
// 				</motion.div>
// 			</div>
						
// 			<motion.div
// 				initial={{ opacity: 0, y: 20 }}
// 				animate={{ opacity: 1, y: 0 }}
// 				transition={{ delay: 0.6 }}
// 				className='mt-4'
// 			>
// 				<motion.button
// 					whileHover={{ scale: 1.05 }}
// 					whileTap={{ scale: 0.95 }}
// 					onClick={handleLogout}
// 					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
// 				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
// 				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
// 				>
// 					Logout
// 				</motion.button>
// 			</motion.div>
// 		</motion.div>
// 	);
// };
// export default DashboardPage;

