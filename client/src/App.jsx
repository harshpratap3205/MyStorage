import DirectoryView from "./DirectoryView";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router=createBrowserRouter([{
  path:'/*',
  element:<DirectoryView/>,
}])
function App(){
  return <RouterProvider router={router}/>
}
export default App;