import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { readError } from '../api/client';
import Loader from './Loader';
import ImageUploadField from './ImageUploadField';
import { useAuth } from '../context/AuthContext';

/**
 * One screen shape for every CMS section (services, approach, values,
 * projects, testimonials, team, insights). Each manager page supplies the
 * API path, the table columns and the form fields; everything else -
 * loading, search, create, edit, publish, delete - is handled here.
 *
 * Field types: text | textarea | number | select | list | checkbox | date | image
 */
const blankFrom = (fields) =>
  fields.reduce((acc, field) => {
    if (field.type === 'checkbox') acc[field.name] = field.initial ?? false;
    else if (field.type === 'number') acc[field.name] = field.initial ?? 0;
    else if (field.type === 'list') acc[field.name] = '';
    else acc[field.name] = field.initial ?? '';
    return acc;
  }, {});

const toForm = (item, fields) =>
  fields.reduce((acc, field) => {
    const value = item[field.name];
    if (field.type === 'list') acc[field.name] = Array.isArray(value) ? value.join('\n') : '';
    else if (field.type === 'checkbox') acc[field.name] = Boolean(value);
    else if (field.type === 'date') acc[field.name] = value ? String(value).slice(0, 10) : '';
    else acc[field.name] = value ?? '';
    return acc;
  }, {});

const toPayload = (form, fields) =>
  fields.reduce((acc, field) => {
    const value = form[field.name];
    if (field.type === 'list') {
      acc[field.name] = String(value || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (field.type === 'number') {
      acc[field.name] = Number(value) || 0;
    } else if (field.type === 'date') {
      acc[field.name] = value || null;
    } else {
      acc[field.name] = value;
    }
    return acc;
  }, {});

const ResourceManager = ({
  title,
  description,
  path,
  singular,
  fields,
  columns,
  searchKeys = ['title'],
  emptyTitle,
  emptyText,
  publishable = true
}) => {
  const { can } = useAuth();
  const mayEdit = can('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(() => blankFrom(fields));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/content/${path}/all`);
      setItems(data.items || []);
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      searchKeys.some((key) => String(item[key] || '').toLowerCase().includes(term))
    );
  }, [items, search, searchKeys]);

  const openNew = () => {
    setForm(blankFrom(fields));
    setEditing('new');
  };

  const openEdit = (item) => {
    setForm(toForm(item, fields));
    setEditing(item);
  };

  const close = () => setEditing(null);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form, fields);
      if (editing === 'new') {
        await api.post(`/content/${path}`, payload);
        setFeedback({ type: 'ok', text: `${singular} created.` });
      } else {
        await api.put(`/content/${path}/${editing._id}`, payload);
        setFeedback({ type: 'ok', text: `${singular} updated.` });
      }
      close();
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (item) => {
    try {
      await api.put(`/content/${path}/${item._id}`, { isPublished: !item.isPublished });
      setFeedback({
        type: 'ok',
        text: item.isPublished ? `${singular} moved to draft.` : `${singular} published.`
      });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const remove = async (item) => {
    const label = item.title || item.name || item.clientName || 'this record';
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/content/${path}/${item._id}`);
      setFeedback({ type: 'ok', text: `${singular} deleted.` });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {mayEdit && (
          <div className="admin-head__actions">
            <button type="button" className="a-btn a-btn--primary" onClick={openNew}>
              Add {singular.toLowerCase()}
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>
          {feedback.text}
        </div>
      )}

      <div className="admin-toolbar">
        <input
          className="admin-toolbar__search"
          placeholder={`Search ${title.toLowerCase()}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="admin-toolbar__spacer" />
        <span className="admin-table__sub">{visible.length} of {items.length} records</span>
      </div>

      {loading ? (
        <Loader label={`Loading ${title.toLowerCase()}`} />
      ) : visible.length === 0 ? (
        <div className="admin-empty">
          <h3>{items.length === 0 ? emptyTitle : 'Nothing matches that search'}</h3>
          <p>{items.length === 0 ? emptyText : 'Try a different word, or clear the search box.'}</p>
          {mayEdit && items.length === 0 && (
            <button type="button" className="a-btn a-btn--primary" onClick={openNew}>
              Add the first {singular.toLowerCase()}
            </button>
          )}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.label}>{col.label}</th>
                ))}
                {publishable && <th>Status</th>}
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item._id}>
                  {columns.map((col) => (
                    <td key={col.label}>{col.render(item)}</td>
                  ))}
                  {publishable && (
                    <td>
                      <span className={`badge badge--${item.isPublished ? 'published' : 'draft'}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  )}
                  <td>
                    <div className="admin-table__actions">
                      {mayEdit && (
                        <button type="button" className="a-btn a-btn--ghost a-btn--sm" onClick={() => openEdit(item)}>
                          Edit
                        </button>
                      )}
                      {mayEdit && publishable && (
                        <button type="button" className="a-btn a-btn--gold a-btn--sm" onClick={() => togglePublish(item)}>
                          {item.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      {mayEdit && (
                        <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => remove(item)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <>
          <button type="button" className="modal-backdrop" onClick={close} aria-label="Close" />
          <div className="modal" role="dialog" aria-modal="true" aria-label={`${editing === 'new' ? 'Add' : 'Edit'} ${singular}`}>
            <div className="modal__head">
              <h2>{editing === 'new' ? `Add ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}</h2>
              <button type="button" className="modal__close" onClick={close} aria-label="Close">×</button>
            </div>

            <form onSubmit={save}>
              <div className="admin-grid-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={`admin-field ${field.type === 'checkbox' ? 'admin-field--check' : ''}`}
                    style={field.full || field.type === 'textarea' || field.type === 'list' || field.type === 'image' ? { gridColumn: '1 / -1' } : undefined}
                  >
                    {field.type === 'checkbox' ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(form[field.name])}
                          onChange={(e) => setField(field.name, e.target.checked)}
                        />
                        {field.label}
                      </label>
                    ) : field.type === 'image' ? (
                      <ImageUploadField
                        id={`f-${field.name}`}
                        label={field.label}
                        value={form[field.name]}
                        onChange={(url) => setField(field.name, url)}
                        hint={field.hint}
                        folder={field.folder || path}
                      />
                    ) : (
                      <>
                        <label htmlFor={`f-${field.name}`}>{field.label}</label>
                        {field.type === 'textarea' || field.type === 'list' ? (
                          <textarea
                            id={`f-${field.name}`}
                            rows={field.rows || (field.type === 'list' ? 6 : 4)}
                            value={form[field.name]}
                            required={field.required}
                            placeholder={field.placeholder}
                            onChange={(e) => setField(field.name, e.target.value)}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            id={`f-${field.name}`}
                            value={form[field.name]}
                            onChange={(e) => setField(field.name, e.target.value)}
                          >
                            {field.options.map((opt) => (
                              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                                {opt.label ?? opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={`f-${field.name}`}
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                            value={form[field.name]}
                            required={field.required}
                            placeholder={field.placeholder}
                            onChange={(e) => setField(field.name, e.target.value)}
                          />
                        )}
                      </>
                    )}
                    {field.hint && field.type !== 'image' && <span className="admin-field__hint">{field.hint}</span>}
                  </div>
                ))}
              </div>

              <div className="modal__foot">
                <button type="button" className="a-btn a-btn--ghost" onClick={close}>Cancel</button>
                <button type="submit" className="a-btn a-btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : `Save ${singular.toLowerCase()}`}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceManager;
