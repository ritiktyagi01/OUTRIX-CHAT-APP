import './App.css';
import { Routes,Route} from 'react-router-dom';
import Homepage from './pages/Homepage';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { ChakraProvider } from "@chakra-ui/react";

import Signup from './pages/SIgnup';
function App() {
  return (
    
    <div className="App">
    <Routes>
<Route path='/'  element={<Homepage/>} ></Route>
<Route path = '/chat' element={<Chat/>}></Route>
<Route path = '/signup' element={<Signup/>}></Route>
<Route path = '/login' element={<Login/>}></Route>




  
 </Routes>
    </div>
      );
}

export default App;
