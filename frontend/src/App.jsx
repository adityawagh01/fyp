import "./App.css";
import { useNavigate } from 'react-router-dom';

function App() {

  const navigateTo=useNavigate();

  const handleUserClick=()=>{
    navigateTo(`/user`);
  }
  const handleAdminClick=()=>{
    navigateTo(`/admin`);
  }

  return (
    <div className="main-app">
      <h1 className="heading">Final Year Project</h1>
      <div className="buttons">
        <button style={{borderRadius: '40px'}} onClick={handleUserClick}>User</button>
        <button onClick={handleAdminClick}>Admin</button>
      </div>
    </div>
  );
}

export default App;
