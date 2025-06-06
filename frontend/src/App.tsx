import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import UserProfile from './components/UserProfile';
import HomePage from './pages/HomePage'; // Import HomePage
import CreateReviewPage from './pages/CreateReviewPage'; // Import CreateReviewPage
import EditReviewPage from './pages/EditReviewPage';   // Import EditReviewPage
import './App.css'; // Assuming you have some basic styles

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  return (
    <>
      <nav className="navbar"> {/* Added navbar class */}
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/reviews/create">Create Review</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <header className="App-header">
        <h1>Yobo Review System</h1>
        {isLoading ? (
          <p>Loading session...</p>
        ) : user ? (
          <div className="user-info"> {/* Added user-info class */}
            <span>Welcome, {user.displayName}!</span>
            <LogoutButton />
          </div>
        ) : (
          <LoginButton />
        )}
      </header>

      <main className="main-content"> {/* Added main-content class, removed inline style */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={user ? <UserProfile /> : <p>Please log in to view your profile.</p>} />
          <Route path="/reviews/create" element={user ? <CreateReviewPage /> : <p>Please log in to create a review.</p>} />
          <Route path="/reviews/edit/:id" element={user ? <EditReviewPage /> : <p>Please log in to edit reviews.</p>} />
          {/* Add other routes here */}
        </Routes>
      </main>
    </>
  );
};

// const Home: React.FC = () => { // This can be removed or repurposed if HomePage is the new main page
//   return (
//     <div>
//       <h2>Home Page</h2>
//       <p>Welcome to the application.</p>
//       <UserProfile /> {/* Display user profile on home page as well or remove if redundant */}
//     </div>
//   );
// };

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
