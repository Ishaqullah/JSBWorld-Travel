import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, X, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import './Tours.css';

const TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'dates', label: 'Pricing & Dates' },
  { id: 'categories', label: 'Categories' },
  { id: 'roomTypes', label: 'Room Types' },
  { id: 'accommodations', label: 'Accommodations' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'media', label: 'Media' },
  { id: 'details', label: 'Details' },
  { id: 'extraInfo', label: 'Extra Info' },
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
    tags: '',
  });

  const [dates, setDates] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [images, setImages] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [accommodations, setAccommodations] = useState([]);

  // New sections state
  const [notes, setNotes] = useState([]);
  const [priceIncludes, setPriceIncludes] = useState([]);
  const [activities, setActivities] = useState([]);

  // Temp state for adding new items
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newPriceInclude, setNewPriceInclude] = useState('');
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
        tags: tour.tags || '',
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
      setTourCategories(tour.tourCategories || []);
      setRoomTypes(tour.roomTypes || []);
      setTourCategories(tour.tourCategories || []);
      setRoomTypes(tour.roomTypes || []);
      setAccommodations(tour.accommodations || []);
      setNotes(tour.notes || []);
      setPriceIncludes(tour.priceIncludes?.map(p => p.item) || []);
      setActivities(tour.activities || []);
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
          accommodationTitle: item.accommodationTitle || null,
          accommodationDescription: item.accommodationDescription || null,
          accommodationImage: item.accommodationImage || null,
          activityTitle: item.activityTitle || null,
          activityDescription: item.activityDescription || null,
          activityImage: item.activityImage || null,
          activityPrice: item.activityPrice || null,
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
          tags: formData.tags,
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
        await adminService.updateTourAddOns(id, addOns.map((addOn, idx) => ({
          id: addOn.id && !addOn.isNew ? addOn.id : undefined,
          name: addOn.name,
          description: addOn.description || null,
          price: parseFloat(addOn.price) || 0,
          imageUrl: addOn.imageUrl || null,
          displayOrder: idx,
          isActive: addOn.isActive !== false,
        })));

        // Update tour categories (package categories with price)
        await adminService.updateTourCategories(id, tourCategories.map((c, idx) => ({
          id: c.id || undefined,
          name: c.name,
          price: parseFloat(c.price) ?? 0,
          madinahDescription: c.madinahDescription || null,
          makkahDescription: c.makkahDescription || null,
          displayOrder: idx,
        })));

        await adminService.updateTourRoomTypes(id, roomTypes.map((r, idx) => ({
          id: r.id || undefined,
          name: r.name,
          priceWithoutFlight: parseFloat(r.priceWithoutFlight) ?? 0,
          priceWithFlight: parseFloat(r.priceWithFlight) ?? 0,
          childPriceWithout: parseFloat(r.childPriceWithout) ?? 0,
          childPriceWithFlight: parseFloat(r.childPriceWithFlight) ?? 0,
          displayOrder: idx,
        })));

        // Update accommodations (carousel)
        await adminService.updateTourAccommodations(id, accommodations.map((a, idx) => ({
          id: a.id || undefined,
          name: a.name,
          location: a.location,
          categoryLabel: a.categoryLabel || null,
          ratingText: a.ratingText || null,
          displayOrder: idx,
          images: (a.images || []).map((img, i) => ({
            id: img.id,
            imageUrl: img.imageUrl || img.url,
            displayOrder: i,
          })),
        })));

        // Update new sections
        await adminService.updateTourNotes(id, notes);
        await adminService.updateTourPriceIncludes(id, priceIncludes);
        await adminService.updateTourActivities(id, activities.map((a, idx) => ({
          ...a,
          displayOrder: idx
        })));

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
        accommodationTitle: '',
        accommodationDescription: '',
        accommodationImage: '',
        activityTitle: '',
        activityDescription: '',
        activityImage: '',
        activityPrice: '',
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

  const addPriceInclude = () => {
    if (newPriceInclude.trim()) {
      setPriceIncludes([...priceIncludes, newPriceInclude.trim()]);
      setNewPriceInclude('');
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
              <label className="input-label">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="input"
                placeholder="e.g. Summer Special, Best Seller, Family Friendly"
                value={formData.tags}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">These tags will be displayed as highlights on the tour details page.</p>
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

        {/* Categories Tab (package categories – price added to booking) */}
        {activeTab === 'categories' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Categories Available</h3>
                <p className="text-sm text-gray-500">e.g. 5 Star Standard, 5 Star Deluxe. Selected category price is added per person at booking.</p>
              </div>
              <button
                onClick={() => setTourCategories([...tourCategories, { name: '', price: 0, madinahDescription: '', makkahDescription: '' }])}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>
            {tourCategories.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No categories. Add one to show the &quot;Categories Available&quot; section on the tour page.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tourCategories.map((cat, index) => (
                  <div key={cat.id || `cat-${index}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-700">Category #{index + 1}</h4>
                      <button type="button" onClick={() => setTourCategories(tourCategories.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="input-label required">Name</label>
                        <input type="text" className="input" placeholder="e.g. 5 Star Standard" value={cat.name || ''} onChange={(e) => { const u = [...tourCategories]; u[index].name = e.target.value; setTourCategories(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Price ($) per person</label>
                        <input type="number" className="input" min="0" step="0.01" value={cat.price ?? ''} onChange={(e) => { const u = [...tourCategories]; u[index].price = e.target.value; setTourCategories(u); }} />
                      </div>
                      <div className="input-group md:col-span-2">
                        <label className="input-label">Madinah – hotels/description</label>
                        <input type="text" className="input" placeholder="e.g. Dar Al Hijra Intercontinental" value={cat.madinahDescription || ''} onChange={(e) => { const u = [...tourCategories]; u[index].madinahDescription = e.target.value; setTourCategories(u); }} />
                      </div>
                      <div className="input-group md:col-span-2">
                        <label className="input-label">Makkah – hotels/description</label>
                        <input type="text" className="input" placeholder="e.g. Swissotel" value={cat.makkahDescription || ''} onChange={(e) => { const u = [...tourCategories]; u[index].makkahDescription = e.target.value; setTourCategories(u); }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Room Types Tab (Quad, Triple, Double – per-person prices at booking) */}
        {activeTab === 'roomTypes' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Room Types</h3>
                <p className="text-sm text-gray-500">e.g. Quad, Triple, Double. Customer selects one at booking; price per person (with/without flight) is used for the total.</p>
              </div>
              <button
                onClick={() => setRoomTypes([...roomTypes, { name: '', priceWithoutFlight: '', priceWithFlight: '', childPriceWithout: '', childPriceWithFlight: '' }])}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Add Room Type
              </button>
            </div>
            {roomTypes.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No room types. Add one to show the Room Type selector on the booking page and use these prices instead of date-level pricing.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {roomTypes.map((rt, index) => (
                  <div key={rt.id || `rt-${index}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-700">Room Type #{index + 1}</h4>
                      <button type="button" onClick={() => setRoomTypes(roomTypes.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="input-group">
                        <label className="input-label required">Name</label>
                        <input type="text" className="input" placeholder="e.g. Quad, Triple, Double" value={rt.name || ''} onChange={(e) => { const u = [...roomTypes]; u[index].name = e.target.value; setRoomTypes(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Price without flight ($) per person</label>
                        <input type="number" className="input" min="0" step="0.01" value={rt.priceWithoutFlight ?? ''} onChange={(e) => { const u = [...roomTypes]; u[index].priceWithoutFlight = e.target.value; setRoomTypes(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Price with flight ($) per person</label>
                        <input type="number" className="input" min="0" step="0.01" value={rt.priceWithFlight ?? ''} onChange={(e) => { const u = [...roomTypes]; u[index].priceWithFlight = e.target.value; setRoomTypes(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Child price without flight ($)</label>
                        <input type="number" className="input" min="0" step="0.01" value={rt.childPriceWithout ?? ''} onChange={(e) => { const u = [...roomTypes]; u[index].childPriceWithout = e.target.value; setRoomTypes(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Child price with flight ($)</label>
                        <input type="number" className="input" min="0" step="0.01" value={rt.childPriceWithFlight ?? ''} onChange={(e) => { const u = [...roomTypes]; u[index].childPriceWithFlight = e.target.value; setRoomTypes(u); }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Accommodations Tab (carousel on tour page) */}
        {activeTab === 'accommodations' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Accommodations</h3>
                <p className="text-sm text-gray-500">Hotels/options shown in the accommodation carousel on the tour detail page.</p>
              </div>
              <button
                onClick={() => setAccommodations([...accommodations, { name: '', location: '', categoryLabel: '', ratingText: '', images: [] }])}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Add Accommodation
              </button>
            </div>
            {accommodations.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No accommodations. Add one to show the Accommodation section.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {accommodations.map((acc, index) => (
                  <div key={acc.id || `acc-${index}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-700">Accommodation #{index + 1}</h4>
                      <button type="button" onClick={() => setAccommodations(accommodations.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="input-label required">Name</label>
                        <input type="text" className="input" placeholder="e.g. Dar Al Hijra Intercontinental" value={acc.name || ''} onChange={(e) => { const u = [...accommodations]; u[index].name = e.target.value; setAccommodations(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label required">Location</label>
                        <input type="text" className="input" placeholder="e.g. Madinah" value={acc.location || ''} onChange={(e) => { const u = [...accommodations]; u[index].location = e.target.value; setAccommodations(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Category label</label>
                        <input type="text" className="input" placeholder="e.g. 5 star" value={acc.categoryLabel || ''} onChange={(e) => { const u = [...accommodations]; u[index].categoryLabel = e.target.value; setAccommodations(u); }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Rating text</label>
                        <input type="text" className="input" placeholder="e.g. Rating TripAdvisor travelers" value={acc.ratingText || ''} onChange={(e) => { const u = [...accommodations]; u[index].ratingText = e.target.value; setAccommodations(u); }} />
                      </div>
                      <div className="input-group md:col-span-2">
                        <label className="input-label">Image URLs (one per line)</label>
                        <textarea className="input" rows="3" placeholder="https://..." value={(acc.images || []).map(i => i.imageUrl || i.url || '').join('\n')} onChange={(e) => { const urls = e.target.value.split('\n').filter(Boolean); const u = [...accommodations]; u[index].images = urls.map((url, i) => ({ id: (acc.images || [])[i]?.id, imageUrl: url, url })); setAccommodations(u); }} />
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
                      {/* Accommodation Details */}
                      <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
                        <h4 className="font-semibold mb-3 text-gray-700">Accommodation Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="input-group">
                            <label className="input-label">Title</label>
                            <input
                              type="text"
                              className="input"
                              placeholder="e.g. Hotel Central"
                              value={day.accommodationTitle || ''}
                              onChange={(e) => updateItinerary(index, 'accommodationTitle', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label className="input-label">Image URL</label>
                            <input
                              type="text"
                              className="input"
                              placeholder="https://..."
                              value={day.accommodationImage || ''}
                              onChange={(e) => updateItinerary(index, 'accommodationImage', e.target.value)}
                            />
                          </div>
                          <div className="input-group md:col-span-2">
                            <label className="input-label">Description</label>
                            <textarea
                              className="input"
                              rows="2"
                              placeholder="Brief description of the accommodation..."
                              value={day.accommodationDescription || ''}
                              onChange={(e) => updateItinerary(index, 'accommodationDescription', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Activity Details */}
                      <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
                        <h4 className="font-semibold mb-3 text-gray-700">Activity Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="input-group">
                            <label className="input-label">Title</label>
                            <input
                              type="text"
                              className="input"
                              placeholder="e.g. City Tour"
                              value={day.activityTitle || ''}
                              onChange={(e) => updateItinerary(index, 'activityTitle', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label className="input-label">Image URL</label>
                            <input
                              type="text"
                              className="input"
                              placeholder="https://..."
                              value={day.activityImage || ''}
                              onChange={(e) => updateItinerary(index, 'activityImage', e.target.value)}
                            />
                          </div>
                          <div className="input-group md:col-span-2">
                            <label className="input-label">Description</label>
                            <textarea
                              className="input"
                              rows="2"
                              placeholder="Brief description of the activity..."
                              value={day.activityDescription || ''}
                              onChange={(e) => updateItinerary(index, 'activityDescription', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label className="input-label">Price (Optional)</label>
                            <input
                              type="number"
                              className="input"
                              placeholder="e.g. 50"
                              value={day.activityPrice || ''}
                              onChange={(e) => updateItinerary(index, 'activityPrice', e.target.value)}
                            />
                          </div>
                        </div>
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

        {/* Extra Info Tab (Notes, Price Includes, Activities) */}
        {activeTab === 'extraInfo' && (
          <div className="flex flex-col gap-8">
            {/* 1. Accordion Notes */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Accordion Notes</h3>
                  <p className="text-sm text-gray-500">
                    Collapsible sections like "Important notes", "Useful information", "Offer conditions".
                  </p>
                </div>
                <button
                  onClick={() => setNotes([...notes, { title: '', content: '' }])}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} /> Add Note
                </button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No notes added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group">
                      <button
                        onClick={() => setNotes(notes.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid gap-3">
                        <div>
                          <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Title</label>
                          <input
                            type="text"
                            className="input bg-white"
                            placeholder="e.g. Important notes"
                            value={note.title}
                            onChange={(e) => {
                              const updated = [...notes];
                              updated[index].title = e.target.value;
                              setNotes(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Content</label>
                          <textarea
                            className="input bg-white"
                            rows="3"
                            placeholder="Enter the content here..."
                            value={note.content}
                            onChange={(e) => {
                              const updated = [...notes];
                              updated[index].content = e.target.value;
                              setNotes(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Price Includes List */}
            {/* <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">"The Price Includes" List</h3>
              <p className="text-sm text-gray-500 mb-4">Bullet points shown under "The price includes" section.</p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="input"
                  placeholder="Add an item included in the price..."
                  value={newPriceInclude}
                  onChange={(e) => setNewPriceInclude(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPriceInclude()}
                />
                <button onClick={addPriceInclude} className="btn btn-primary">
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="space-y-2">
                {priceIncludes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200 group">
                    <span className="flex-1 text-gray-700">{item}</span>
                    <button
                      onClick={() => setPriceIncludes(priceIncludes.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {priceIncludes.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No items added yet.</p>
                )}
              </div>
            </div> */}

            {/* 3. Included Activities */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Included Activities</h3>
                  <p className="text-sm text-gray-500">
                    Cards with images, titles, and descriptions.
                  </p>
                </div>
                <button
                  onClick={() => setActivities([...activities, { title: '', description: '', imageUrl: '', badge: 'Included' }])}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} /> Add Activity
                </button>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No activities added yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                      <button
                        onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 z-10"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            {activity.imageUrl ? (
                              <img src={activity.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">No Image</div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <label className="text-[10px] font-bold uppercase text-gray-500 block">Image URL</label>
                              <input
                                type="text"
                                className="input text-xs py-1"
                                placeholder="https://..."
                                value={activity.imageUrl || ''}
                                onChange={(e) => {
                                  const updated = [...activities];
                                  updated[index].imageUrl = e.target.value;
                                  setActivities(updated);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase text-gray-500 block">Badge Text</label>
                              <input
                                type="text"
                                className="input text-xs py-1"
                                placeholder="Included"
                                value={activity.badge || ''}
                                onChange={(e) => {
                                  const updated = [...activities];
                                  updated[index].badge = e.target.value;
                                  setActivities(updated);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-500 block">Title</label>
                          <input
                            type="text"
                            className="input"
                            placeholder="Activity Title"
                            value={activity.title || ''}
                            onChange={(e) => {
                              const updated = [...activities];
                              updated[index].title = e.target.value;
                              setActivities(updated);
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-500 block">Description</label>
                          <textarea
                            className="input"
                            rows="2"
                            placeholder="Brief description..."
                            value={activity.description || ''}
                            onChange={(e) => {
                              const updated = [...activities];
                              updated[index].description = e.target.value;
                              setActivities(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
