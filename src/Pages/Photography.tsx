import React from 'react';
import TiledPlane from '../components/TiledPlane';

const PhotographyPage: React.FC = () => {
  // This would typically come from your data source or API
  const photos = [
    './assets/about/me.jpg',
    './assets/photography/bird.jpg',
    './assets/ceramics/garlic.jpg',
    './assets/cooking/chicken_pasta.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',

    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',
    './assets/photography/bird.jpg',

  ];

  return (
    <div className="photography-page">
      <h1 className="sr-only">Photography Portfolio</h1>
      <TiledPlane photos={photos} />
    </div>
  );
};

export default PhotographyPage;