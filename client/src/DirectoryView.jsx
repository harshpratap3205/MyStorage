
// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';


// function DirectoryView() {
//   const [data, setData] = useState([]);
//   const [editingFile, setEditingFile] = useState(null);
//   const [newFileName, setNewFileName] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [newDirectoryName, setNewDirectoryName] = useState("");
//   const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, fileName: null });

//   const BaseURL = import.meta.env.VITE_BASE_URL;
//   const navigate = useNavigate();
//   const { "*": dirname } = useParams();

//   // Fetch directory data
//   async function getdata() {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${BaseURL}/directory/${dirname}`);
//       const personInfo = await response.json();
//       setData(personInfo);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // Handle file input change
//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//       setUploadStatus('');
//     }
//   };

//   // Handle file upload
//   const uploadHandler = async (e) => {
//     e.preventDefault();

//     if (!selectedFile) {
//       setUploadStatus('Please select a file first!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('path', dirname);

//     try {
//       setUploadStatus('Uploading...');
//       const response = await fetch(`${BaseURL}/file/${selectedFile.name}`, {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setUploadStatus('File uploaded successfully!');
//         setSelectedFile(null);
//         document.getElementById('file').value = '';
//         await getdata();
//       } else {
//         setUploadStatus(`Upload failed: ${result.message || response.statusText}`);
//       }
//     } catch (error) {
//       setUploadStatus('Error: ' + error.message);
//     }
//   };

//   // Handle file delete
//   async function deleteHandler(fileName) {
//     try {
//       const response = await fetch(`${BaseURL}/file/${dirname}/${fileName}`, {
//         method: "DELETE",
//       });
//       const data = await response.json();
//       await getdata();
//       setDeleteConfirmation({ show: false, fileName: null });
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   }

//   const showDeleteConfirmation = (fileName) => {
//     setDeleteConfirmation({ show: true, fileName });
//   };

//   const cancelDelete = () => {
//     setDeleteConfirmation({ show: false, fileName: null });
//   };

//   // Handle rename
//   function renameHandler(fileName) {
//     setEditingFile(fileName);
//     setNewFileName(fileName);
//   }

//   async function renameFileHandler(oldName, newName) {
//     try {
//       const response = await fetch(`${BaseURL}/file/${dirname}/${oldName}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ newName: `${dirname}/${newName}` })
//       });
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Rename failed:", error);
//       throw error;
//     }
//   }

//   async function saveRename(oldName, newName) {
//     if (!newName.trim()) return alert("File name cannot be empty.");
//     try {
//       await renameFileHandler(oldName, newName);
//       await getdata();
//       setEditingFile(null);
//       setNewFileName('');
//     } catch (error) {
//       console.error("Save rename failed:", error);
//     }
//   }

//   function cancelRename() {
//     setEditingFile(null);
//     setNewFileName('');
//   }

//   // Handle create new directory
//   const createDirectoryHandler = async (e) => {
//     e.preventDefault();
//     if (!newDirectoryName.trim()) return alert("Folder name cannot be empty.");

//     try {
//       const encodedName = encodeURIComponent(newDirectoryName);
//       const res = await fetch(`${BaseURL}/directory/${dirname}/${encodedName}`, {
//         method: "POST",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setNewDirectoryName("");
//         getdata();
//       } else {
//         alert(data.message || "Error creating folder");
//       }
//     } catch (error) {
//       console.error("Folder creation failed:", error);
//     }
//   };

//   useEffect(() => {
//     getdata();
//   }, [dirname]);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.1,
//         when: "beforeChildren"
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { 
//         type: "spring", 
//         stiffness: 300, 
//         damping: 24 
//       }
//     },
//     hover: { 
//       scale: 1.02, 
//       boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//       transition: { duration: 0.2 }
//     }
//   };

//   const modalVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: { 
//       opacity: 1, 
//       scale: 1,
//       transition: { 
//         type: "spring", 
//         stiffness: 300, 
//         damping: 25 
//       }
//     },
//     exit: { opacity: 0, scale: 0.9 }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <AnimatePresence>
//         {/* Delete Confirmation Modal */}
//         {deleteConfirmation.show && (
//           <motion.div 
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div 
//               className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//             >
//               <div className="text-center">
//                 <motion.div 
//                   className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ repeat: 3, duration: 0.2 }}
//                 >
//                   <svg className="h-6 w-6 text-red-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </motion.div>
//                 <h3 className="text-lg font-medium text-gray-900 mt-4">Delete File</h3>
//                 <div className="mt-2">
//                   <p className="text-gray-500">
//                     Are you sure you want to delete <span className="font-semibold">"{deleteConfirmation.fileName}"</span>? This action cannot be undone.
//                   </p>
//                 </div>
//                 <div className="mt-5 flex justify-center space-x-4">
//                   <motion.button
//                     type="button"
//                     onClick={cancelDelete}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     type="button"
//                     onClick={() => deleteHandler(deleteConfirmation.fileName)}
//                     className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Delete
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8 py-12">
//         <motion.div 
//           className="text-center"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             MY FILE MANAGER
//           </h1>
//           <p className="mt-2 text-gray-600 max-w-lg">
//             Upload, manage, and access your files securely
//           </p>
//         </motion.div>

//         <motion.div 
//           className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 border border-blue-100 transition-all hover:shadow-xl"
//           initial={{ scale: 0.95, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.1, duration: 0.5 }}
//           whileHover={{ 
//             y: -5,
//             boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//           }}
//         >
//           <div className="text-center mb-4">
//             <motion.div 
//               className="inline-block p-3 bg-blue-50 rounded-full mb-3"
//               animate={{ 
//                 rotate: [0, 5, -5, 0],
//                 y: [0, -5, 0]
//               }}
//               transition={{ 
//                 duration: 2,
//                 repeat: Infinity,
//                 repeatType: "reverse"
//               }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//               </svg>
//             </motion.div>
//             <h2 className="text-xl font-semibold text-gray-800">Upload your file</h2>
//             <p className="text-gray-500 text-sm mt-1">Supported formats: PDF, DOC, JPG, PNG, and more</p>
//           </div>
          
//           <form onSubmit={uploadHandler} className="mt-4">
//             <motion.label 
//               htmlFor="file" 
//               className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
//               whileHover={{ borderColor: "#3b82f6" }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                 <svg className="w-10 h-10 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
//                 </svg>
//                 <p className="mb-2 text-sm text-gray-500">
//                   <span className="font-semibold">Click to upload</span> or drag and drop
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {selectedFile ? selectedFile.name : 'Select your file here'}
//                 </p>
//               </div>
//               <input 
//                 id="file" 
//                 type="file" 
//                 className="hidden" 
//                 onChange={handleFileChange} 
//               />
//             </motion.label>
            
//             <div className="mt-4 flex flex-col items-center">
//               <motion.button 
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center disabled:opacity-50"
//                 disabled={!selectedFile || uploadStatus === 'Uploading...'}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload File'}
//               </motion.button>
              
//               {uploadStatus && (
//                 <motion.div 
//                   className={`mt-3 text-sm font-medium ${
//                     uploadStatus.includes('success') ? 'text-green-600' : 
//                     uploadStatus.includes('Uploading') ? 'text-blue-600' : 
//                     'text-red-600'
//                   }`}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   {uploadStatus}
//                 </motion.div>
//               )}
//             </div>
//           </form>
//         </motion.div>

//         <motion.div 
//           className="w-full max-w-4xl"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Files</h3>
          
//           <div className="w-full max-w-4xl mb-6">
//             <form 
//               onSubmit={createDirectoryHandler}
//               className="flex flex-col sm:flex-row items-center gap-3"
//             >
//               <input
//                 type="text"
//                 value={newDirectoryName}
//                 onChange={(e) => setNewDirectoryName(e.target.value)}
//                 placeholder="Enter folder name"
//                 className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//               <motion.button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Create Folder
//               </motion.button>
//             </form>
//           </div>
          
//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <motion.div 
//                 className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               />
//             </div>
//           ) : (
//             <motion.div 
//               className="space-y-3"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               {data.length === 0 ? (
//                 <motion.div 
//                   className="text-center py-8 text-gray-500 bg-white rounded-lg p-8"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//                   </svg>
//                   <p className="mt-4">No files found. Upload your first file!</p>
//                 </motion.div>
//               ) : (
//                 data.map(({name:data,isDirectory}, index) => (
//                   <motion.div 
//                     key={index} 
//                     className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between shadow-sm"
//                     variants={itemVariants}
//                     whileHover="hover"
//                   >
//                     <div className="flex items-center flex-1 min-w-0">
//                       <div className="bg-blue-100 p-2 rounded-lg mr-3">
//                         {isDirectory ? (
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//                           </svg>
//                         ) : (
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         {editingFile === data ? (
//                           <input
//                             type="text"
//                             value={newFileName}
//                             onChange={(e) => setNewFileName(e.target.value)}
//                             className="border rounded px-2 py-1 text-sm w-full"
//                             autoFocus
//                           />
//                         ) : (
//                           <span className="font-medium text-gray-800 truncate block">{data}</span>
//                         )}
//                         <div className="text-xs text-gray-500 truncate">
//                           {isDirectory ? "Folder" : "File"} • Today
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex space-x-2 ml-3 flex-wrap justify-end">
//                       {editingFile === data ? (
//                         <>
//                           <motion.button 
//                             onClick={() => saveRename(data, newFileName)}
//                             className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                             Save
//                           </motion.button>
//                           <motion.button 
//                             onClick={cancelRename}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                             Cancel
//                           </motion.button>
//                         </>
//                       ) : (
//                         <>
//                          { isDirectory ? (
//                            <Link to={`${dirname?'/'+dirname:""}/${data}`}>
//                               <motion.button 
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                               >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                                 </svg>
//                                 Open
//                               </motion.button>
//                             </Link>
//                          ) : (
//                            <a href={`${BaseURL}/file${dirname?'/'+dirname:''}/${data}?action=open`} >
//                               <motion.button 
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                               >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                 </svg>
//                                 View
//                               </motion.button>
//                             </a>
//                          )}
//                          { !isDirectory && (
//                            <a href={`${BaseURL}/file${dirname?'/'+dirname:''}/${data}?action=download`} download>
//                               <motion.button 
//                                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                               >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                                 </svg>
//                               Download
//                               </motion.button>
//                             </a>
//                          )}
//                           <motion.button 
//                             onClick={() => renameHandler(data)}
//                             className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                             Rename
//                           </motion.button>
//                           <motion.button 
//                             onClick={() => showDeleteConfirmation(data)} 
//                             className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Delete
//                           </motion.button>
//                         </>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))
//               )}
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default DirectoryView;
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function DirectoryView() {
  const [data, setData] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, fileName: null });

  const BaseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { "*": dirname } = useParams();

  // Fetch directory data
  async function getdata() {
    try {
      setIsLoading(true);
      const response = await fetch(`${BaseURL}/directory/${dirname}`);
      const personInfo = await response.json();
      setData(personInfo);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('');
    }
  };

  // Handle file upload
  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('path', dirname);

    try {
      setUploadStatus('Uploading...');
      const response = await fetch(`${BaseURL}/file/${selectedFile.name}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        setSelectedFile(null);
        document.getElementById('file').value = '';
        await getdata();
      } else {
        setUploadStatus(`Upload failed: ${result.message || response.statusText}`);
      }
    } catch (error) {
      setUploadStatus('Error: ' + error.message);
    }
  };

  // Handle file delete
  async function deleteHandler(fileName) {
    try {
      const response = await fetch(`${BaseURL}/file/${dirname}/${fileName}`, {
        method: "DELETE",
      });
      const data = await response.json();
      await getdata();
      setDeleteConfirmation({ show: false, fileName: null });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  const showDeleteConfirmation = (fileName) => {
    setDeleteConfirmation({ show: true, fileName });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, fileName: null });
  };

  // Handle rename
  function renameHandler(fileName) {
    setEditingFile(fileName);
    setNewFileName(fileName);
  }

  async function renameFileHandler(oldName, newName) {
    try {
      const response = await fetch(`${BaseURL}/file/${dirname}/${oldName}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: `${dirname}/${newName}` })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Rename failed:", error);
      throw error;
    }
  }

  async function saveRename(oldName, newName) {
    if (!newName.trim()) return alert("File name cannot be empty.");
    try {
      await renameFileHandler(oldName, newName);
      await getdata();
      setEditingFile(null);
      setNewFileName('');
    } catch (error) {
      console.error("Save rename failed:", error);
    }
  }

  function cancelRename() {
    setEditingFile(null);
    setNewFileName('');
  }

  // Handle create new directory
  const createDirectoryHandler = async (e) => {
    e.preventDefault();
    if (!newDirectoryName.trim()) return alert("Folder name cannot be empty.");

    try {
      const encodedName = encodeURIComponent(newDirectoryName);
      const res = await fetch(`${BaseURL}/directory/${dirname}/${encodedName}`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setNewDirectoryName("");
        getdata();
      } else {
        alert(data.message || "Error creating folder");
      }
    } catch (error) {
      console.error("Folder creation failed:", error);
    }
  };

  useEffect(() => {
    getdata();
  }, [dirname]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    },
    hover: { 
      scale: 1.02, 
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }
    },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <AnimatePresence>
        {/* Delete Confirmation Modal */}
        {deleteConfirmation.show && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-md mx-2"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center">
                <motion.div 
                  className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: 3, duration: 0.2 }}
                >
                  <svg className="h-6 w-6 text-red-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">Delete File</h3>
                <div className="mt-2">
                  <p className="text-gray-500">
                    Are you sure you want to delete <span className="font-semibold">"{deleteConfirmation.fileName}"</span>? This action cannot be undone.
                  </p>
                </div>
                <div className="mt-5 flex justify-center space-x-4">
                  <motion.button
                    type="button"
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => deleteHandler(deleteConfirmation.fileName)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 py-8 sm:py-12">
        <motion.div 
          className="text-center px-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MY FILE MANAGER
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-lg">
            Upload, manage, and access your files securely
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-xl bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-blue-100 transition-all hover:shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ 
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="text-center mb-4">
            <motion.div 
              className="inline-block p-3 bg-blue-50 rounded-full mb-3"
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-800">Upload your file</h2>
            <p className="text-gray-500 text-sm mt-1">Supported formats: PDF, DOC, JPG, PNG, and more</p>
          </div>
          
          <form onSubmit={uploadHandler} className="mt-4">
            <motion.label 
              htmlFor="file" 
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
              whileHover={{ borderColor: "#3b82f6" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {selectedFile ? selectedFile.name : 'Select your file here'}
                </p>
              </div>
              <input 
                id="file" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </motion.label>
            
            <div className="mt-4 flex flex-col items-center">
              <motion.button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center disabled:opacity-50"
                disabled={!selectedFile || uploadStatus === 'Uploading...'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload File'}
              </motion.button>
              
              {uploadStatus && (
                <motion.div 
                  className={`mt-3 text-sm font-medium ${
                    uploadStatus.includes('success') ? 'text-green-600' : 
                    uploadStatus.includes('Uploading') ? 'text-blue-600' : 
                    'text-red-600'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {uploadStatus}
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div 
          className="w-full max-w-4xl px-2 sm:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Files</h3>
          
          <div className="w-full max-w-4xl mb-6">
            <form 
              onSubmit={createDirectoryHandler}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <input
                type="text"
                value={newDirectoryName}
                onChange={(e) => setNewDirectoryName(e.target.value)}
                placeholder="Enter folder name"
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <motion.button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Folder
              </motion.button>
            </form>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <motion.div 
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {data.length === 0 ? (
                <motion.div 
                  className="text-center py-8 text-gray-500 bg-white rounded-lg p-6 sm:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-4">No files found. Upload your first file!</p>
                </motion.div>
              ) : (
                data.map(({name:data,isDirectory}, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm"
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center flex-1 min-w-0 w-full sm:w-auto">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        {isDirectory ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {editingFile === data ? (
                          <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="border rounded px-2 py-1 text-sm w-full"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-gray-800 truncate block text-sm sm:text-base">{data}</span>
                        )}
                        <div className="text-xs text-gray-500 truncate">
                          {isDirectory ? "Folder" : "File"} • Today
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3 sm:mt-0 ml-0 sm:ml-3 justify-end w-full sm:w-auto">
                      {editingFile === data ? (
                        <>
                          <motion.button 
                            onClick={() => saveRename(data, newFileName)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                          </motion.button>
                          <motion.button 
                            onClick={cancelRename}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <>
                         { isDirectory ? (
                           <Link to={`${dirname?'/'+dirname:""}/${data}`} className="flex-1 min-w-[80px] sm:min-w-0">
                              <motion.button 
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center w-full justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Open
                              </motion.button>
                            </Link>
                         ) : (
                           <a href={`${BaseURL}/file${dirname?'/'+dirname:''}/${data}?action=open`} className="flex-1 min-w-[80px] sm:min-w-0">
                              <motion.button 
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center w-full justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </motion.button>
                            </a>
                         )}
                         { !isDirectory && (
                           <a href={`${BaseURL}/file${dirname?'/'+dirname:''}/${data}?action=download`} download className="flex-1 min-w-[80px] sm:min-w-0">
                              <motion.button 
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center w-full justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              Download
                              </motion.button>
                            </a>
                         )}
                          <motion.button 
                            onClick={() => renameHandler(data)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center flex-1 min-w-[80px] sm:min-w-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Rename
                          </motion.button>
                          <motion.button 
                            onClick={() => showDeleteConfirmation(data)} 
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center flex-1 min-w-[80px] sm:min-w-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default DirectoryView;