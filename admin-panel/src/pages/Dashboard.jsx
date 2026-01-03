import { useState, useEffect } from 'react';
import { Map, Calendar, DollarSign, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-label">Total Tours</span>
            <div className="stats-card-icon primary">
              <Map size={20} />
            </div>
          </div>
          <div className="stats-card-value">{stats?.tours?.total || 0}</div>
          <div className="stats-card-change positive">
            <TrendingUp size={14} style={{ marginRight: '4px', display: 'inline' }} />
            {stats?.tours?.published || 0} published
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-label">Total Bookings</span>
            <div className="stats-card-icon success">
              <Calendar size={20} />
            </div>
          </div>
          <div className="stats-card-value">{stats?.bookings?.total || 0}</div>
          <div className="stats-card-change">
            {stats?.bookings?.pending || 0} pending
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-label">Revenue</span>
            <div className="stats-card-icon warning">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stats-card-value">
            ${Number(stats?.revenue?.total || 0).toLocaleString()}
          </div>
          <div className="stats-card-change positive">
            <TrendingUp size={14} style={{ marginRight: '4px', display: 'inline' }} />
            All time
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-label">Confirmed</span>
            <div className="stats-card-icon info">
              <Users size={20} />
            </div>
          </div>
          <div className="stats-card-value">{stats?.bookings?.confirmed || 0}</div>
          <div className="stats-card-change">
            Confirmed bookings
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Link to="/tours/new" className="btn btn-primary">
              <Map size={18} />
              Create New Tour
            </Link>
            <Link to="/tours" className="btn btn-secondary">
              View All Tours
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
          {stats?.recentBookings?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <div className="font-medium text-sm">{booking.user?.name || 'Unknown'}</div>
                    <div className="text-sm text-muted">{booking.tour?.title || 'Unknown Tour'}</div>
                  </div>
                  <span className={`badge ${booking.status === 'CONFIRMED' ? 'badge-success' : booking.status === 'PENDING' ? 'badge-warning' : 'badge-neutral'}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
