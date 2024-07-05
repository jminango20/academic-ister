import { React} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Header from './components/common/Header';
// import { useUserHash } from './contexts/UserHashContext';
import { useAuthUser } from './contexts/AuthUserContext'; //Custom hook to manage context
import './App.css'

// Components
import ConnectMetaMask from '@pages/ConnectWallet';
import Home from '@pages/Home';
import PageNotFound from './components/pages/PageNotFound';

const App = () => {
  // const { userHash } = useUserHash();
  const { authenticated } = useAuthUser();

  return (
      <Router>
            <Routes>
              <Route path="/" element={authenticated ? <Navigate to="/main" /> : <ConnectMetaMask />} />
              <Route path="/main" element={authenticated ? <Home /> : <Navigate to="/" />} />
              <Route path="*" element={PageNotFound}/>
            </Routes>
      </Router>
  );
};

// const App = () => {
//   return (
//     <AuthUserProvider>
//       <Router>
//         <AuthUserRoutes />
//       </Router>
//     </AuthUserProvider>
//   );
// };

// const AuthUserRoutes = () => {
//   const { authenticated } = useAuthUser();
  
//   return (
//     <Routes>
//       <Route path="/" element={authenticated ? <Navigate to="/main" /> : <ConnectMetaMask />} />
//       <Route path="/main" element={authenticated ? <Home /> : <Navigate to="/" />} />
//     </Routes>
//   );
// };

export default App;
