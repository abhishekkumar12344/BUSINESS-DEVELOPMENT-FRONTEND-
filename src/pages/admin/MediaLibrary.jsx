import { useCallback, useEffect, useRef, useState } from 'react';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const FOLDERS = ['general', 'services', 'projects', 'team', 'insights'];
const readableSize = (bytes) => (bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);

/** Upload images and documents once, then reuse their URLs across the CMS. */
const MediaLibrary = () => {
  const { can } = useAuth();
  const mayEdit = can('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER');
  const fileInput = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState('');
  const [uploadFolder, setUploadFolder] = useState('general');
  const [feedback, setFeedback] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/media', { params: folder ? { folder } : {} });
      setItems(data.items || []);
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => { load(); }, [load]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    body.append('folder', uploadFolder);
    body.append('title', file.name);

    setUploading(true);
    try {
      await api.post('/admin/media', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFeedback({ type: 'ok', text: `${file.name} uploaded.` });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error, 'Upload failed. Check the file type and size.') });
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback({ type: 'ok', text: `Copied ${url}` });
    } catch {
      setFeedback({ type: 'error', text: `Copy failed. The URL is ${url}` });
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.originalName || item.title}?`)) return;
    try {
      await api.delete(`/admin/media/${item._id}`);
      setFeedback({ type: 'ok', text: 'File deleted.' });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Media</h1>
          <p>Images and documents used across the website. Copy a file URL straight into any content form.</p>
        </div>
        {mayEdit && (
          <div className="admin-head__actions">
            <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} aria-label="Upload folder">
              {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <input ref={fileInput} type="file" id="media-file" onChange={upload} hidden />
            <label className="a-btn a-btn--primary" htmlFor="media-file">
              {uploading ? 'Uploading…' : 'Upload file'}
            </label>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      <div className="admin-toolbar">
        <select value={folder} onChange={(e) => setFolder(e.target.value)}>
          <option value="">All folders</option>
          {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <span className="admin-toolbar__spacer" />
        <span className="admin-table__sub">{items.length} files</span>
      </div>

      {loading ? (
        <Loader label="Loading media" />
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <h3>No files in this folder</h3>
          <p>Upload a logo, a project photo or a PDF, then paste its URL into any content form.</p>
        </div>
      ) : (
        <div className="media-grid">
          {items.map((item) => (
            <figure className="media-card" key={item._id}>
              {item.mimeType?.startsWith('image/') ? (
                <img src={item.url} alt={item.altText || item.title} loading="lazy" />
              ) : (
                <span className="media-card__file">{(item.mimeType || 'file').split('/').pop().toUpperCase()}</span>
              )}
              <figcaption>
                <strong>{item.title || item.originalName}</strong>
                <span className="admin-table__sub">{item.folder} · {readableSize(item.size)}</span>
                <span className="admin-table__actions">
                  <button type="button" className="a-btn a-btn--ghost a-btn--sm" onClick={() => copyUrl(item.url)}>Copy URL</button>
                  {mayEdit && (
                    <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => remove(item)}>Delete</button>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
