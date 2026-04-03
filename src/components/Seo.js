import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://tooligans.vercel.app';

export default function Seo({ title, description, path = '' }) {
  const fullTitle = title ? `${title} — Tooligans` : 'Tooligans — Developer Utilities, All in One Place';
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
