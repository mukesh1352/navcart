import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Load user from localStorage or session
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        try {
          const res = await fetch('https://navcart.onrender.com/api/me', {
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.error('Failed to fetch session info:', err);
        }
      }
    };

    loadUser();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        const updatedUser = localStorage.getItem('user');
        setUser(updatedUser ? JSON.parse(updatedUser) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

const handleLogout = async () => {
  try {
    await fetch('https://navcart.onrender.com/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  } catch (err) {
    console.error('Logout failed:', err);
  }
};


  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-gray-800">NavCart</h1>
      <div className="space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
