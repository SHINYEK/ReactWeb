import './App.css';
import RouterPage from './components/RouterPage';
import back from './image/back.jpg';
import Container from 'react-bootstrap/Container';
import {BoxContext} from './components/BoxContext';
import BoxModal from './components/BoxModal';
import { useState } from 'react';
import './paging.css';

function App() {
  const [box, setBox] = useState({
    
      show:false,
      message:"",
      action:null
    
  });

  return (
    <BoxContext.Provider value={{box,setBox}}>
      <Container>
        <div className="App">
          <img src={back} width="100%"></img>
          <RouterPage/>
        </div>
        {box.show && <BoxModal box={box} setBox={setBox}/>}
      </Container>
    </BoxContext.Provider> 
  );
}

export default App;
