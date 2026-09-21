import { useRef, useState } from 'react';
import api, { readError } from '../api/client';
import './ImageUploadField.css';

/**
 * A single field that lets an admin either upload a file directly (stored in
 * the Media Library and turned into a ready-to-use URL) or paste an existing
 * URL by hand. Used anywhere the CMS needs an image: services, projects,
 * team photos, testimonials, insights covers and the site-wide settings.
 *
 * IMPORTANT: the upload request below deliberately does NOT set a
 * Content-Type header. When sending a FormData body, the browser must be
 * left to set "multipart/form-data; boundary=..." itself - if that header is
 * forced by hand (as this project's Media Library page used to do) the
 * boundary is missing and the server cannot parse the upload at all.
 */
const ImageUploadField = ({ id, label, value, onChange, hint, folder = 'general' }) => {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('file', file);
    body.append('folder', folder);
    body.append('title', file.name);

    setUploading(true);
    setError('');
    try {
      // Do not let the api client's default 'Content-Type: application/json'
      // header apply here - explicitly clearing it (not just omitting it)
      // is required so axios leaves the FormData body untouched and the
      // browser can attach the correct multipart boundary itself.
      const { data } = await api.post('/admin/media', body, {
        headers: { 'Content-Type': undefined }
      });
      onChange(data.media.url);
    } catch (err) {
      setError(readError(err, 'Upload failed. Check the file type and size.'));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className="image-field">
      {label && <label htmlFor={id}>{label}</label>}

      <div className="image-field__row">
        <div className="image-field__preview">
          {value ? (
            <img src={value} alt="" />
          ) : (
            <span className="image-field__placeholder">No image</span>
          )}
        </div>

        <div className="image-field__controls">
          <input
            ref={fileInput}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFile}
            hidden
          />
          <label htmlFor={id} className="a-btn a-btn--ghost a-btn--sm image-field__upload-btn">
            {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          </label>

          {value && (
            <button
              type="button"
              className="a-btn a-btn--ghost a-btn--sm"
              onClick={() => onChange('')}
            >
              Remove
            </button>
          )}

          <input
            type="text"
            className="image-field__url"
            value={value || ''}
            placeholder="or paste an image URL"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      {error && <span className="image-field__error">{error}</span>}
      {hint && !error && <span className="admin-field__hint">{hint}</span>}
    </div>
  );
};

export default ImageUploadField;
