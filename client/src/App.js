import './App.css';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';

function App() {
  return (
    //using the BEM naming convention
    <div className="app">
      <div className="app__body"> 
          <Sidebar addNewChat/>

          <Chat />

      </div>


    </div>  
  );
}

export default App;
