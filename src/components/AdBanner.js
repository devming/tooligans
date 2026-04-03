import React, { useEffect, useRef } from 'react';
import './AdBanner.css';

export default function AdBanner({ slot, format = 'auto', style: styleProp }) {
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    if (!ref.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {}
  }, []);

  // slot이 없으면 아무것도 렌더하지 않음 (Auto Ads만 동작)
  if (!slot) return null;

  return (
    <div className="ad-banner" style={styleProp}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6176394344908792"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
