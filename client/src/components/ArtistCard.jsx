import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const ArtistCard = ({ artist }) => {
  return (
    <div className="flex items-center p-3 hover:bg-navy-light rounded-lg transition-colors duration-200 group">
      <div className="h-12 w-12 mr-4">
        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="flex-1">
        <h3 className="text-content font-medium truncate">{artist.name}</h3>
        <div className="flex text-text-dark text-xs">
          <span className="mr-4">{artist.followers} Followers</span>
          <span>{artist.plays} Plays</span>
        </div>
      </div>
      <button className="text-text-dark hover:text-text-light p-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="More options">
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
};

export default ArtistCard;