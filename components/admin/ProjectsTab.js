'use client';
import { useState, useEffect } from 'react';

export default function ProjectsTab() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'rohini');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Image added successfully!');
        fetchImages();
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      alert('Upload failed!');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (path) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setDeleting(path);
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path }),
      });
      const data = await res.json();
      if (data.success) {
        fetchImages();
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (err) {
      alert('Delete failed!');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Projects Showcase</h2>
        
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading...' : '+ Add New Project Image'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {images.map((imgPath, idx) => (
            <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)', backgroundColor: 'var(--card-bg)' }}>
              <img src={imgPath} alt="Project" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <button 
                onClick={() => handleDelete(imgPath)}
                disabled={deleting === imgPath}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {deleting === imgPath ? '...' : <i className="fa-solid fa-trash"></i>}
              </button>
            </div>
          ))}
          {images.length === 0 && <p>No projects found.</p>}
        </div>
      )}
    </div>
  );
}
