import { Link } from 'react-router-dom';
import GrowthArc from '../../components/GrowthArc';
import './NotFound.css';

const NotFound = () => (
  <section className="notfound">
    <GrowthArc className="notfound__motif" />
    <div className="shell notfound__inner">
      <p className="notfound__code">404</p>
      <h1>This page is not on our map.</h1>
      <p className="notfound__text">
        The page you are looking for may have moved or never existed. Start again from the homepage, or tell us what you
        were trying to find.
      </p>
      <div className="notfound__actions">
        <Link to="/" className="btn btn--gold">Back to homepage</Link>
        <Link to="/contact" className="btn btn--ghost">Contact us</Link>
      </div>
    </div>
  </section>
);

export default NotFound;
