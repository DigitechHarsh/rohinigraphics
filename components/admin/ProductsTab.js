'use client';
import { useState, useEffect } from 'react';

export default function ProductsTab() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State for View
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [images, setImages] = useState([]);

  const [deleting, setDeleting] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Manufacturing Services');
  const [folderMode, setFolderMode] = useState('existing'); // 'existing' or 'new'
  const [uploadSubExisting, setUploadSubExisting] = useState('');
  const [uploadSubNew, setUploadSubNew] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      
      const formattedServices = Object.keys(data).map(categoryName => ({
        name: categoryName,
        subcategories: Object.keys(data[categoryName]).map(subName => ({
          name: subName,
          images: data[categoryName][subName]
        }))
      }));

      setServicesData(formattedServices);
      
      // Keep view selection in sync
      if (selectedCategory && selectedSub) {
        const cat = formattedServices.find(c => c.name === selectedCategory);
        const sub = cat?.subcategories?.find(s => s.name === selectedSub);
        if (sub) setImages(sub.images);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    setSelectedSub('');
    setImages([]);
  };

  const handleSubChange = (subName) => {
    setSelectedSub(subName);
    const cat = servicesData.find(c => c.name === selectedCategory);
    const sub = cat?.subcategories?.find(s => s.name === subName);
    if (sub) {
      setImages(sub.images);
    }
  };

  const handleDelete = async (path) => {
    if (!confirm('Are you sure you want to delete this product image?')) return;

    setDeleting(path);
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path }),
      });
      const data = await res.json();
      if (data.success) {
        fetchServices();
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (err) {
      alert('Delete failed!');
    } finally {
      setDeleting(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select an image file first.");
      return;
    }

    let targetSubcategory = '';
    if (folderMode === 'existing') {
      targetSubcategory = uploadSubExisting;
    } else {
      targetSubcategory = uploadSubNew.trim();
    }

    if (!targetSubcategory) {
      alert("Please provide a valid subcategory/folder name.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('folder', `${uploadCategory}/${targetSubcategory}`);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Image successfully added!');
        fetchServices();
        setIsModalOpen(false);
        setUploadFile(null);
        setUploadSubNew('');
        
        // Auto-select the newly uploaded folder to view it
        setSelectedCategory(uploadCategory);
        setSelectedSub(targetSubcategory);
        
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const currentCategoryObj = servicesData.find(c => c.name === selectedCategory);
  
  // For Modal Dropdown
  const modalCategoryObj = servicesData.find(c => c.name === uploadCategory);
  const modalSubcategories = modalCategoryObj?.subcategories || [];

  return (
    <div style={{ padding: '1rem' }}>
      
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Products & Services</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fa-solid fa-plus"></i> Add New Image
        </button>
      </div>

      {loading && !servicesData.length ? (
        <p>Loading products...</p>
      ) : (
        <>
          {/* Filtering Dropdowns */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', minWidth: '200px' }}
            >
              <option value="">-- Select Category to View --</option>
              {servicesData.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <select 
              value={selectedSub} 
              onChange={(e) => handleSubChange(e.target.value)}
              disabled={!selectedCategory}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', minWidth: '200px', opacity: !selectedCategory ? 0.5 : 1 }}
            >
              <option value="">-- Select Subcategory to View --</option>
              {currentCategoryObj?.subcategories?.map(sub => (
                <option key={sub.name} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Image Grid */}
          {!selectedSub ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-muted)' }}>
              Please select a category and subcategory from the dropdowns above to view its images.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {images.map((imgPath, idx) => (
                <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)', backgroundColor: 'var(--card-bg)' }}>
                  <img src={imgPath} alt="Product" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <button 
                    onClick={() => handleDelete(imgPath)}
                    disabled={deleting === imgPath}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {deleting === imgPath ? '...' : <i className="fa-solid fa-trash"></i>}
                  </button>
                </div>
              ))}
              {images.length === 0 && <p>No images found in this folder.</p>}
            </div>
          )}
        </>
      )}

      {/* Upload Modal Popup */}
      {isModalOpen && (
        <div className="modal-overlay active" style={{ zIndex: 1000 }}>
          <div className="modal-card" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-cloud-arrow-up" style={{ color: 'var(--brand-color)' }}></i> Upload New Image
              </h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="modal-body">
              
              {/* 1. File Selection */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>1. Select Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}
                  required
                />
              </div>

              {/* 2. Main Category */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>2. Select Category</label>
                <select
                  className="form-select"
                  value={uploadCategory}
                  onChange={(e) => {
                    setUploadCategory(e.target.value);
                    setUploadSubExisting('');
                  }}
                  style={{ background: 'var(--bg-secondary)', width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                >
                  <option value="Manufacturing Services">Manufacturing Services</option>
                  <option value="Publicity Services">Publicity Services</option>
                </select>
              </div>

              {/* 3. Subcategory Mode Toggle */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>3. Subcategory Folder</label>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      checked={folderMode === 'existing'} 
                      onChange={() => setFolderMode('existing')} 
                    />
                    Existing Folder
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      checked={folderMode === 'new'} 
                      onChange={() => setFolderMode('new')} 
                    />
                    Create New Folder
                  </label>
                </div>

                {/* Subcategory Selection / Creation */}
                {folderMode === 'existing' ? (
                  <select
                    className="form-select"
                    value={uploadSubExisting}
                    onChange={(e) => setUploadSubExisting(e.target.value)}
                    style={{ background: 'var(--bg-secondary)', width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                    required
                  >
                    <option value="">-- Select Existing Folder --</option>
                    {modalSubcategories.map(sub => (
                      <option key={sub.name} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Neon Signs"
                    value={uploadSubNew}
                    onChange={(e) => setUploadSubNew(e.target.value)}
                    style={{ background: 'var(--bg-secondary)', width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                    required
                  />
                )}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={uploading}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
