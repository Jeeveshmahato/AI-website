import { SITE_NAME, SITE_TAGLINE } from "../lib/constants";

// React 19 hoists <title>, <meta> and <link> rendered anywhere into <head>.
const Seo = ({ title, description, noindex = false, path }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TAGLINE}`;
  const canonical = `${window.location.origin}${path ?? window.location.pathname}`;
  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />
    </>
  );
};

export default Seo;
