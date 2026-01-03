import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import './Tours.css';

const ToursList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadTours();
  }, [pagination.currentPage, statusFilter]);

  const loadTours = async () => {
    setLoading(true);
    try {
      const data = await adminService.getTours({
        page: pagination.currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
      });
      setTours(data.tours);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load tours');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    loadTours();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await adminService.deleteTour(id);
      toast.success('Tour deleted successfully');
      loadTours();
    } catch (error) {
      toast.error('Failed to delete tour');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PUBLISHED: 'badge-success',
      DRAFT: 'badge-warning',
      ARCHIVED: 'badge-neutral',
    };
    return statusStyles[status] || 'badge-neutral';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tours</h1>
          <p className="page-subtitle">Manage your tour listings</p>
        </div>
        <Link to="/tours/new" className="btn btn-primary">
          <Plus size={18} />
          Add New Tour
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <select
          className="input"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination({ ...pagination, currentPage: 1 });
          }}
          style={{ width: '160px' }}
        >
          <option value="all">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Tours Table */}
      <div className="table-container">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="spinner"></div>
          </div>
        ) : tours.length === 0 ? (
          <div className="empty-state">
            <MapPin size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No tours found</h3>
            <p className="empty-state-text">
              {search ? 'Try adjusting your search or filters' : 'Get started by creating your first tour'}
            </p>
            {!search && (
              <Link to="/tours/new" className="btn btn-primary mt-4">
                <Plus size={18} />
                Create Tour
              </Link>
            )}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tour</th>
                <th>Location</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th>Dates</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <div className="tour-cell">
                      <img
                        src={tour.featuredImage || tour.images?.[0]?.imageUrl || '/placeholder.jpg'}
                        alt={tour.title}
                        className="tour-thumbnail"
                      />
                      <div>
                        <div className="tour-title">{tour.title}</div>
                        <div className="tour-category">{tour.category?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{tour.location}</td>
                  <td>{tour.duration} days</td>
                  <td>${Number(tour.price).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(tour.status)}`}>
                      {tour.status}
                    </span>
                  </td>
                  <td>{tour._count?.dates || 0} dates</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn"
                        onClick={() => window.open(`http://localhost:5173/tours/${tour.slug}`, '_blank')}
                        title="View on site"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/tours/${tour.id}/edit`)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn danger"
                        onClick={() => handleDelete(tour.id, tour.title)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={pagination.currentPage === 1}
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            >
              &lt;
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${page === pagination.currentPage ? 'active' : ''}`}
                onClick={() => setPagination({ ...pagination, currentPage: page })}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursList;
