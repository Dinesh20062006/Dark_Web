import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, ShieldAlert, Activity, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('/admin/users');
      setUsers(usersRes.data);
      
      const statsRes = await axios.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetUser = async (userId) => {
    if (window.confirm('WARNING: Are you sure you want to completely wipe out this user\'s progress?')) {
      try {
        await axios.put(`/admin/users/${userId}/reset`);
        fetchData();
        alert('User progress reset.');
      } catch (error) {
        alert('Failed to reset user.');
      }
    }
  };

  if (loading) return <div className="text-center mt-20 text-accent">Loading Admin Panels...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center space-x-3 mb-8 border-b border-accent/30 pb-4">
        <ShieldAlert className="w-10 h-10 text-accent" />
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest text-accent">System Administration</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 border-t-2 border-t-blue-500">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-gray-400 text-sm uppercase">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="glass-card p-6 border-t-2 border-t-purple-500">
            <Activity className="w-8 h-8 text-purple-500 mb-2" />
            <p className="text-gray-400 text-sm uppercase">Submissions</p>
            <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
          </div>
          <div className="glass-card p-6 border-t-2 border-t-primary">
            <CheckCircle className="w-8 h-8 text-primary mb-2" />
            <p className="text-gray-400 text-sm uppercase">Correct Solves</p>
            <p className="text-3xl font-bold">{stats.correctSubmissions}</p>
          </div>
          <div className="glass-card p-6 border-t-2 border-t-red-500">
            <XCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-gray-400 text-sm uppercase">Failed Solves</p>
            <p className="text-3xl font-bold">{stats.incorrectSubmissions}</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 font-mono text-gray-300">Registered Operatives</h2>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm font-mono">
          <thead className="bg-black/40 border-b border-accent/20 text-accent">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Level</th>
              <th className="p-4 text-center">Points</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  {user.username} {user.role === 'admin' && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded ml-2">ADMIN</span>}
                </td>
                <td className="p-4 text-gray-400">{user.email}</td>
                <td className="p-4 text-center text-white font-bold">{user.currentLevel}</td>
                <td className="p-4 text-center text-primary">{user.totalPoints}</td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleResetUser(user._id)}
                      className="text-red-400 hover:text-red-300 transition-colors flex items-center justify-end w-full space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Wipe Progress</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
