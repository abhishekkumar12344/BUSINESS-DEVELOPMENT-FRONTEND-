import './Loader.css';

const Loader = ({ label = 'Loading' }) => (
  <div className="loader" role="status" aria-live="polite">
    <span className="loader__arc" />
    <span className="loader__label">{label}</span>
  </div>
);

export default Loader;
