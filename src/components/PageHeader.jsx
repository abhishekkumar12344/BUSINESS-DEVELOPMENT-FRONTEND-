import GrowthArc from './GrowthArc';
import './PageHeader.css';

/** The shared editorial masthead used at the top of every inner page. */
const PageHeader = ({ eyebrow, title, intro, children }) => (
  <header className="page-header">
    <GrowthArc className="page-header__motif" />
    <div className="shell page-header__inner">
      {eyebrow && <p className="kicker">{eyebrow}</p>}
      <h1 className="page-header__title">{title}</h1>
      {intro && <p className="page-header__intro">{intro}</p>}
      {children}
    </div>
  </header>
);

export default PageHeader;
