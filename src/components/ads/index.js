import React from 'react';
import { useLocation } from 'react-router-dom';

const defaultStyle = {
  display: 'block',
  width: '728px',
  height: '90px',
};

function AdGoogle({
  adSlot,
  className,
  style = {},
  adFormat,
  responsive,
  position = 'top',
  justOnHome = false,
}) {
  const { pathname } = useLocation();
  const showAd = justOnHome ? pathname === '/' : true;

  function loadAds() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (showAd) loadAds();
  }, [showAd]);

  if (justOnHome && pathname !== '/') return null;
  return (
    <div align="center" className={`${className} cd-ads-google`}>
      <ins
        className="adsbygoogle"
        style={{ ...defaultStyle, ...style }}
        data-ad-client="ca-pub-6316061427279046"
        data-ad-slot={adSlot} //"5121779799"
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
}

export default AdGoogle;
