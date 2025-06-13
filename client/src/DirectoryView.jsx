import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import dotenv from 'dotenv';

function DirectoryView() {
  const [data, setData] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState("");
const BaseURL=import.meta.env.VITE_BASE_URL;
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    fileName: null
  });
  const {"*":dirname}=useParams()

  async function getdata() {
    try {
      setIsLoading(true);
      const response = await fetch(`${BaseURL}/directory/${dirname}`);
      const personInfo = await response.json();
      console.log(personInfo)
      setData(personInfo);
     
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('');
    }
  };

  const uploadHandler = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadStatus('Please select a file first!');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('path', dirname);
    console.log(dirname)
    try {
      setUploadStatus('Uploading...');
      const response = await fetch(`${BaseURL}/file/${selectedFile.name}`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        await getdata();
        setSelectedFile(null);
        document.getElementById('file').value = '';
      } else {
        const errorData = await response.json();
        setUploadStatus(`Upload failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      setUploadStatus('Error: ' + error.message);
    }
  };

  async function deleteHandler(fileName) {
    try {
      const response = await fetch(`${BaseURL}/file/${dirname}/${fileName}`, { 
        method: "DELETE" ,
      });
      const data = await response.json();
      console.log(data);
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

  function renameHandler(fileName) {
    setEditingFile(fileName);
    setNewFileName(fileName);
  }
  
  async function renameFileHandler(oldName, newName) {
    try {
      const response = await fetch(`${BaseURL}/file/${dirname}/${oldName}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName :`${dirname}/${newName}`})
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Rename failed:", error);
      throw error;
    }
  }

  async function saveRename(oldName, newName) {
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

  useEffect(() => {
    getdata();
  }, []);
const createDirectoryHandler = async (e) => {
  e.preventDefault();
  if (!newDirectoryName.trim()) return alert("Folder name cannot be empty.");

  try {
    const res = await fetch(`${BaseURL}/directory/${dirname}/${newDirectoryName}`, {
      method: "POST",
    
    });

    const data = await res.json();

    if (res.ok) {
      setNewDirectoryName("");
      getdata(); // or your method to refresh file list
    } else {
      alert(data.message || "Error creating folder");
    }
  } catch (error) {
    console.error("Folder creation failed:", error);
  }
};


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        {/* Delete Confirmation Modal */}
        {deleteConfirmation.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">Delete File</h3>
                <div className="mt-2">
                  <p className="text-gray-500">
                    Are you sure you want to delete <span className="font-semibold">"{deleteConfirmation.fileName}"</span>? This action cannot be undone.
                  </p>
                </div>
                <div className="mt-5 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteHandler(deleteConfirmation.fileName)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MY FILE MANAGER
            </h1>
            <p className="mt-2 text-gray-600 max-w-lg">
              Upload, manage, and access your files securely
            </p>
          </div>

          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 border border-blue-100 transition-all hover:shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-block p-3 bg-blue-50 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Upload your file</h2>
              <p className="text-gray-500 text-sm mt-1">Supported formats: PDF, DOC, JPG, PNG</p>
            </div>
            
            <form onSubmit={uploadHandler} className="mt-4">
              <label 
                htmlFor="file" 
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
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
              </label>
              
              <div className="mt-4 flex flex-col items-center">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center disabled:opacity-50"
                  disabled={!selectedFile || uploadStatus === 'Uploading...'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload File'}
                </button>
                
                {uploadStatus && (
                  <div className={`mt-3 text-sm font-medium ${
                    uploadStatus.includes('success') ? 'text-green-600' : 
                    uploadStatus.includes('Uploading') ? 'text-blue-600' : 
                    'text-red-600'
                  }`}>
                    {uploadStatus}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Files</h3>
            
            <div className="w-full max-w-2xl mb-6">
  <form 
    onSubmit={createDirectoryHandler}
    className="flex flex-col sm:flex-row items-center gap-3"
  >
    <input
      type="text"
      value={newDirectoryName}
      onChange={(e) => setNewDirectoryName(e.target.value)}
      placeholder="Enter folder name"
      className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm"
    >
      Create Folder
    </button>
  </form>
</div>

            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {data.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No files found. Upload your first file!
                  </div>
                ) : (
                  data.map(({name:data,isDirectory}, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          {editingFile === data ? (
                            <input
                              type="text"
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              className="border rounded px-2 py-1 text-sm w-full"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-gray-800">{data}</span>
                          )}
                          <div className="text-xs text-gray-500">Uploaded: Today</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {editingFile === data ? (
                          <>
                            <button 
                              onClick={() => saveRename(data, newFileName)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              Save
                            </button>
                            <button 
                              onClick={cancelRename}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                         
                           { isDirectory&&<Link to={`${dirname?'/'+dirname:""}/${data}`}>
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Open
                              </button>
                            </Link>}
                           {!isDirectory?<a href={`${BaseURL}/file${dirname?'/'+dirname:''}/${data}?action=open`} >
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Open
                              </button>
                            </a>:''}
                           { !isDirectory?<a href={`${BaseURL}/file${dirname?'/'+dirname:''}/${data}?action=download`} download>
                              <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                               Download
                              </button>
                            </a>:''}
                            <button 
                              onClick={() => renameHandler(data)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Rename
                            </button>
                            <button 
                              onClick={() => showDeleteConfirmation(data)} 
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DirectoryView;