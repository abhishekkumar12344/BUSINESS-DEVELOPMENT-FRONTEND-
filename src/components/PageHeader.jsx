import GrowthArc from './GrowthArc';
import './PageHeader.css';

/**
 * The shared editorial masthead used at the top of every inner page.
 * Pass `image` to give it the same photograph-behind-text treatment as the
 * homepage hero (a clear, lightly-tinted background image rather than a
 * flat colour block); omit it to keep the plain forest-green header.
 */
const PageHeader = ({ eyebrow, title, intro, image, children }) => (
  <header
    className={`page-header ${image ? 'page-header--image' : ''}`}
    style={image ? { '--page-header-image': `url("${image}")` } : undefined}
  >
    {image && <div className="page-header__overlay" />}
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
