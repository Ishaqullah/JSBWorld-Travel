import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, X, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import './Tours.css';

const TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'dates', label: 'Pricing & Dates' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'media', label: 'Media' },
  { id: 'details', label: 'Details' },
  { id: 'addons', label: 'Add-ons' },
];

const TourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    location: '',
    price: '',
    depositFee: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'MODERATE',
    featuredImage: '',
    description: '',
    status: 'DRAFT',
  });

  const [dates, setDates] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [images, setImages] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [addOns, setAddOns] = useState([]);

  // Temp state for adding new items
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadTour();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const cats = await adminService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadTour = async () => {
    try {
      const tour = await adminService.getTourById(id);
      setFormData({
        title: tour.title || '',
        categoryId: tour.categoryId || '',
        location: tour.location || '',
        price: tour.price || '',
        depositFee: tour.depositFee || '',
        duration: tour.duration || '',
        maxGroupSize: tour.maxGroupSize || '',
        difficulty: tour.difficulty || 'MODERATE',
        featuredImage: tour.featuredImage || '',
        description: tour.description || '',
        status: tour.status || 'DRAFT',
      });
      setDates(tour.dates || []);
      setItinerary(tour.itinerary || []);
      setImages(tour.images || []);
      setHighlights(tour.highlights?.map(h => h.highlight) || []);
      
      const included = tour.inclusions?.filter(i => i.type === 'INCLUDED').map(i => i.item) || [];
      const excluded = tour.inclusions?.filter(i => i.type === 'EXCLUDED').map(i => i.item) || [];
      setInclusions(included);
      setExclusions(excluded);
      setAddOns(tour.addOns || []);
    } catch (error) {
      toast.error('Failed to load tour');
      navigate('/tours');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Category is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.location?.trim()) {
      toast.error('Location is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Valid duration is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required');
      setActiveTab('basic');
      return;
    }

    setSaving(true);
    try {
      const tourData = {
        ...formData,
        price: parseFloat(formData.price),
        depositFee: formData.depositFee ? parseFloat(formData.depositFee) : null,
        duration: parseInt(formData.duration),
        maxGroupSize: parseInt(formData.maxGroupSize) || 20,
        images: images.map((img, i) => ({ url: img.imageUrl || img.url, alt: img.altText || img.alt || formData.title })),
        highlights,
        inclusions,
        exclusions,
        itinerary: itinerary.map((item, i) => ({
          dayNumber: item.dayNumber || i + 1,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl || null,
        })),
        dates: dates.map(d => ({
          startDate: d.startDate,
          endDate: d.endDate,
          availableSlots: d.availableSlots,
          priceWithoutFlight: d.priceWithoutFlight,
          priceWithFlight: d.priceWithFlight,
          earlyBirdPriceWithout: d.earlyBirdPriceWithout || null,
          earlyBirdPriceWith: d.earlyBirdPriceWith || null,
          earlyBirdDeadline: d.earlyBirdDeadline || null,
          childPriceWithout: d.childPriceWithout,
          childPriceWithFlight: d.childPriceWithFlight,
          singleSupplement: d.singleSupplement || 0,
        })),
      };

      if (isEditing) {
        await adminService.updateTour(id, {
          title: formData.title,
          categoryId: formData.categoryId,
          location: formData.location,
          price: parseFloat(formData.price),
          depositFee: formData.depositFee ? parseFloat(formData.depositFee) : null,
          duration: parseInt(formData.duration),
          maxGroupSize: parseInt(formData.maxGroupSize) || 20,
          difficulty: formData.difficulty,
          featuredImage: formData.featuredImage,
          description: formData.description,
          status: formData.status,
        });

        // Update related entities
        if (itinerary.length > 0) {
          await adminService.updateTourItinerary(id, itinerary);
        }
        if (images.length > 0) {
          await adminService.updateTourImages(id, images.map(img => ({
            url: img.imageUrl || img.url,
            alt: img.altText || img.alt || formData.title,
          })));
        }
        
        // Always update highlights and inclusions (even if empty, to allow deletion)
        await adminService.updateTourHighlights(id, highlights);
        await adminService.updateTourInclusions(id, inclusions, exclusions);
        
        // Update tour dates - handle each date individually
        if (dates.length > 0) {
          for (const date of dates) {
            const dateData = {
              startDate: date.startDate,
              endDate: date.endDate,
              availableSlots: parseInt(date.availableSlots) || parseInt(formData.maxGroupSize) || 20,
              priceWithoutFlight: parseFloat(date.priceWithoutFlight) || parseFloat(formData.price),
              priceWithFlight: parseFloat(date.priceWithFlight) || parseFloat(formData.price),
              earlyBirdPriceWithout: date.earlyBirdPriceWithout ? parseFloat(date.earlyBirdPriceWithout) : null,
              earlyBirdPriceWith: date.earlyBirdPriceWith ? parseFloat(date.earlyBirdPriceWith) : null,
              earlyBirdDeadline: date.earlyBirdDeadline || null,
              childPriceWithout: parseFloat(date.childPriceWithout) || parseFloat(formData.price) * 0.7,
              childPriceWithFlight: parseFloat(date.childPriceWithFlight) || parseFloat(formData.price) * 0.7,
              singleSupplement: parseFloat(date.singleSupplement) || 0,
            };
            
            // If it's a new date (id starts with 'new-'), create it
            if (String(date.id).startsWith('new-')) {
              await adminService.createTourDate(id, dateData);
            } else {
              // Update existing date
              await adminService.updateTourDate(date.id, dateData);
            }
          }
        }

        // Update add-ons
        if (addOns.length > 0) {
          await adminService.updateTourAddOns(id, addOns.map((addOn, idx) => ({
            id: addOn.id && !addOn.isNew ? addOn.id : undefined,
            name: addOn.name,
            description: addOn.description || null,
            price: parseFloat(addOn.price) || 0,
            imageUrl: addOn.imageUrl || null,
            displayOrder: idx,
            isActive: addOn.isActive !== false,
          })));
        }

        toast.success('Tour updated successfully');
      } else {
        await adminService.createTour(tourData);
        toast.success('Tour created successfully');
      }
      navigate('/tours');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to save tour';
      toast.error(message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Date management
  const addNewDate = () => {
    const newDate = {
      id: `new-${Date.now()}`,
      startDate: '',
      endDate: '',
      availableSlots: formData.maxGroupSize || 20,
      priceWithoutFlight: formData.price || 0,
      priceWithFlight: formData.price || 0,
      earlyBirdPriceWithout: '',
      earlyBirdPriceWith: '',
      earlyBirdDeadline: '',
      childPriceWithout: '',
      childPriceWithFlight: '',
      singleSupplement: 0,
    };
    setDates([...dates, newDate]);
  };

  const updateDate = (index, field, value) => {
    const updated = [...dates];
    updated[index] = { ...updated[index], [field]: value };
    setDates(updated);
  };

  const removeDate = (index) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  // Itinerary management
  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      {
        id: `new-${Date.now()}`,
        dayNumber: itinerary.length + 1,
        title: '',
        description: '',
        imageUrl: '',
      },
    ]);
  };

  const updateItinerary = (index, field, value) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeItinerary = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  // Add list items
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions([...inclusions, newInclusion.trim()]);
      setNewInclusion('');
    }
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setExclusions([...exclusions, newExclusion.trim()]);
      setNewExclusion('');
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { imageUrl: newImageUrl.trim(), altText: formData.title }]);
      setNewImageUrl('');
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
    <div className="tour-form-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/tours')} className="btn btn-ghost">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">{isEditing ? 'Edit Tour' : 'Create New Tour'}</h1>
            <p className="page-subtitle">
              {isEditing ? 'Update tour information' : 'Add a new tour to your listings'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="form-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`form-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="form-tab-content">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="form-grid">
            <div className="input-group full-width">
              <label className="input-label required">Title</label>
              <input
                type="text"
                name="title"
                className="input"
                placeholder="e.g. Amazing Morocco Adventure"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label required">Category</label>
              <select
                name="categoryId"
                className="input"
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label required">Location</label>
              <input
                type="text"
                name="location"
                className="input"
                placeholder="e.g. Morocco"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label required">Base Price ($)</label>
              <input
                type="number"
                name="price"
                className="input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Deposit Fee (per person)</label>
              <input
                type="number"
                name="depositFee"
                className="input"
                placeholder="200.00"
                min="0"
                step="0.01"
                value={formData.depositFee}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Optional: Deposit amount per person</p>
            </div>

            <div className="input-group">
              <label className="input-label required">Duration (days)</label>
              <input
                type="number"
                name="duration"
                className="input"
                placeholder="7"
                min="1"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Max Group Size</label>
              <input
                type="number"
                name="maxGroupSize"
                className="input"
                placeholder="20"
                min="1"
                value={formData.maxGroupSize}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Difficulty</label>
              <select
                name="difficulty"
                className="input"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="EASY">Easy</option>
                <option value="MODERATE">Moderate</option>
                <option value="CHALLENGING">Challenging</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Status</label>
              <select
                name="status"
                className="input"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label className="input-label">Featured Image URL</label>
              <input
                type="url"
                name="featuredImage"
                className="input"
                placeholder="https://example.com/image.jpg"
                value={formData.featuredImage}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group full-width">
              <label className="input-label required">Description</label>
              <textarea
                name="description"
                className="input"
                rows="5"
                placeholder="Describe the tour experience..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Pricing & Dates Tab */}
        {activeTab === 'dates' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Available Dates</h3>
              <button onClick={addNewDate} className="btn btn-primary btn-sm">
                <Plus size={16} />
                Add Date
              </button>
            </div>

            {dates.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No dates added yet. Click "Add Date" to create one.</p>
              </div>
            ) : (
              <div className="dates-list">
                {dates.map((date, index) => (
                  <div key={date.id || index} className="date-card">
                    <div className="date-card-header">
                      <span className="date-card-title">Date #{index + 1}</span>
                      <button onClick={() => removeDate(index)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="date-card-grid">
                      <div className="input-group">
                        <label className="input-label required">Start Date</label>
                        <input
                          type="date"
                          className="input"
                          value={date.startDate?.split('T')[0] || ''}
                          onChange={(e) => updateDate(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">End Date</label>
                        <input
                          type="date"
                          className="input"
                          value={date.endDate?.split('T')[0] || ''}
                          onChange={(e) => updateDate(index, 'endDate', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Available Slots</label>
                        <input
                          type="number"
                          className="input"
                          min="1"
                          value={date.availableSlots || ''}
                          onChange={(e) => updateDate(index, 'availableSlots', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Price Without Flight</label>
                        <input
                          type="number"
                          className="input"
                          min="0"
                          step="0.01"
                          value={date.priceWithoutFlight || ''}
                          onChange={(e) => updateDate(index, 'priceWithoutFlight', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Price With Flight</label>
                        <input
                          type="number"
                          className="input"
                          min="0"
                          step="0.01"
                          value={date.priceWithFlight || ''}
                          onChange={(e) => updateDate(index, 'priceWithFlight', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Child Price (No Flight)</label>
                        <input
                          type="number"
                          className="input"
                          min="0"
                          step="0.01"
                          value={date.childPriceWithout || ''}
                          onChange={(e) => updateDate(index, 'childPriceWithout', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Child Price (With Flight)</label>
                        <input
                          type="number"
                          className="input"
                          min="0"
                          step="0.01"
                          value={date.childPriceWithFlight || ''}
                          onChange={(e) => updateDate(index, 'childPriceWithFlight', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Single Supplement</label>
                        <input
                          type="number"
                          className="input"
                          min="0"
                          step="0.01"
                          value={date.singleSupplement || ''}
                          onChange={(e) => updateDate(index, 'singleSupplement', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="date-card-grid mt-4">
                      <div className="input-group">
                        <label className="input-label">Early Bird Price (No Flight)</label>
                        <input
                          type="number"
                          className="input"
                          min="0"
                          step="0.01"
                          value={date.earlyBirdPriceWithout || ''}
                          onChange={(e) => updateDate(index, 'earlyBirdPriceWithout', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Early Bird Price (With Flight)</label>
                        <input
                          type="number"
                          className="input"
                          min="0"
                          step="0.01"
                          value={date.earlyBirdPriceWith || ''}
                          onChange={(e) => updateDate(index, 'earlyBirdPriceWith', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Early Bird Deadline</label>
                        <input
                          type="date"
                          className="input"
                          value={date.earlyBirdDeadline?.split('T')[0] || ''}
                          onChange={(e) => updateDate(index, 'earlyBirdDeadline', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Day-by-Day Itinerary</h3>
              <button onClick={addItineraryDay} className="btn btn-primary btn-sm">
                <Plus size={16} />
                Add Day
              </button>
            </div>

            {itinerary.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No itinerary added yet. Click "Add Day" to create one.</p>
              </div>
            ) : (
              <div className="itinerary-list">
                {itinerary.map((day, index) => (
                  <div key={day.id || index} className="itinerary-item">
                    <div className="itinerary-header">
                      <span className="itinerary-day">Day {day.dayNumber || index + 1}</span>
                      <button onClick={() => removeItinerary(index)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="input-group">
                        <label className="input-label">Title</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Arrival & Welcome"
                          value={day.title || ''}
                          onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="input-group full-width">
                        <label className="input-label">Description</label>
                        <textarea
                          className="input"
                          rows="3"
                          placeholder="Describe the day's activities..."
                          value={day.description || ''}
                          onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="input-group full-width">
                        <label className="input-label">Image URL</label>
                        <input
                          type="url"
                          className="input"
                          placeholder="https://example.com/day-image.jpg"
                          value={day.imageUrl || ''}
                          onChange={(e) => updateItinerary(index, 'imageUrl', e.target.value)}
                        />
                        {day.imageUrl && (
                          <img 
                            src={day.imageUrl} 
                            alt={`Day ${day.dayNumber || index + 1}`}
                            className="mt-2 max-h-32 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div>
            <h3 className="font-semibold mb-4">Tour Images</h3>
            
            <div className="add-item-row mb-6">
              <input
                type="url"
                className="input"
                placeholder="Enter image URL..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addImage()}
              />
              <button onClick={addImage} className="btn btn-primary">
                <Plus size={16} />
                Add
              </button>
            </div>

            {images.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No images added yet. Add image URLs above.</p>
              </div>
            ) : (
              <div className="images-grid">
                {images.map((img, index) => (
                  <div key={index} className="image-card">
                    <img src={img.imageUrl || img.url} alt={img.altText || 'Tour image'} />
                    <div className="image-card-overlay">
                      <button
                        className="image-card-btn"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="flex flex-col gap-6">
            {/* Highlights */}
            <div>
              <h3 className="font-semibold mb-3">Highlights</h3>
              <div className="list-items">
                {highlights.map((item, index) => (
                  <div key={index} className="list-item">
                    <span className="list-item-text">{item}</span>
                    <button
                      className="list-item-remove"
                      onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-item-row">
                <input
                  type="text"
                  className="input"
                  placeholder="Add a highlight..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                />
                <button onClick={addHighlight} className="btn btn-secondary">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <h3 className="font-semibold mb-3">What's Included</h3>
              <div className="list-items">
                {inclusions.map((item, index) => (
                  <div key={index} className="list-item">
                    <span className="list-item-text">{item}</span>
                    <button
                      className="list-item-remove"
                      onClick={() => setInclusions(inclusions.filter((_, i) => i !== index))}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-item-row">
                <input
                  type="text"
                  className="input"
                  placeholder="Add an inclusion..."
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInclusion()}
                />
                <button onClick={addInclusion} className="btn btn-secondary">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Exclusions */}
            <div>
              <h3 className="font-semibold mb-3">What's Not Included</h3>
              <div className="list-items">
                {exclusions.map((item, index) => (
                  <div key={index} className="list-item">
                    <span className="list-item-text">{item}</span>
                    <button
                      className="list-item-remove"
                      onClick={() => setExclusions(exclusions.filter((_, i) => i !== index))}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-item-row">
                <input
                  type="text"
                  className="input"
                  placeholder="Add an exclusion..."
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
                />
                <button onClick={addExclusion} className="btn btn-secondary">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add-ons Tab */}
        {activeTab === 'addons' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Tour Add-ons</h3>
                <p className="text-sm text-gray-500">Optional extras users can add to their booking</p>
              </div>
              <button 
                onClick={() => setAddOns([...addOns, { 
                  name: '', 
                  description: '', 
                  price: '', 
                  imageUrl: '', 
                  isActive: true,
                  displayOrder: addOns.length,
                  isNew: true 
                }])}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Add New Add-on
              </button>
            </div>

            {addOns.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No add-ons created yet. Click "Add New Add-on" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addOns.map((addOn, index) => (
                  <div key={addOn.id || `new-${index}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-700">Add-on #{index + 1}</h4>
                      <button
                        onClick={() => setAddOns(addOns.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="input-label required">Name</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., Airport Pickup"
                          value={addOn.name}
                          onChange={(e) => {
                            const updated = [...addOns];
                            updated[index].name = e.target.value;
                            setAddOns(updated);
                          }}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label className="input-label required">Price ($)</label>
                        <input
                          type="number"
                          className="input"
                          placeholder="50.00"
                          min="0"
                          step="0.01"
                          value={addOn.price}
                          onChange={(e) => {
                            const updated = [...addOns];
                            updated[index].price = e.target.value;
                            setAddOns(updated);
                          }}
                        />
                      </div>
                      
                      <div className="input-group md:col-span-2">
                        <label className="input-label">Description</label>
                        <textarea
                          className="input"
                          rows="2"
                          placeholder="Brief description of the add-on..."
                          value={addOn.description || ''}
                          onChange={(e) => {
                            const updated = [...addOns];
                            updated[index].description = e.target.value;
                            setAddOns(updated);
                          }}
                        />
                      </div>
                      
                      <div className="input-group">
                        <label className="input-label">Image URL</label>
                        <input
                          type="url"
                          className="input"
                          placeholder="https://example.com/image.jpg"
                          value={addOn.imageUrl || ''}
                          onChange={(e) => {
                            const updated = [...addOns];
                            updated[index].imageUrl = e.target.value;
                            setAddOns(updated);
                          }}
                        />
                      </div>
                      
                      <div className="input-group flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addOn.isActive !== false}
                            onChange={(e) => {
                              const updated = [...addOns];
                              updated[index].isActive = e.target.checked;
                              setAddOns(updated);
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button onClick={() => navigate('/tours')} className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          {saving ? (
            <>
              <Loader2 size={18} className="spinner" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              {isEditing ? 'Update Tour' : 'Create Tour'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TourForm;
