
import React from 'react';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { dimensionColors } from '../../development/DimensionIcons';

interface DimensionIconsProps {
  iconSize: number;
}

const DimensionIcons: React.FC<DimensionIconsProps> = ({ iconSize }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top (Humility) */}
      <div className="absolute top-[15%] left-[50%] transform -translate-x-1/2">
        <Gauge size={iconSize} style={{ color: dimensionColors.humility }} />
      </div>
      
      {/* Top Right (Empathy) */}
      <div className="absolute top-[25%] right-[15%] transform">
        <HeartHandshake size={iconSize} style={{ color: dimensionColors.empathy }} />
      </div>
      
      {/* Bottom Right (Accountability) */}
      <div className="absolute bottom-[25%] right-[15%] transform">
        <ChartNoAxesCombined size={iconSize} style={{ color: dimensionColors.accountability }} />
      </div>
      
      {/* Bottom (Resiliency) */}
      <div className="absolute bottom-[15%] left-[50%] transform -translate-x-1/2">
        <TreePalm size={iconSize} style={{ color: dimensionColors.resiliency }} />
      </div>
      
      {/* Bottom Left (Transparency) */}
      <div className="absolute bottom-[25%] left-[15%] transform">
        <Blend size={iconSize} style={{ color: dimensionColors.transparency }} />
      </div>
      
      {/* Top Left (Inclusivity) */}
      <div className="absolute top-[25%] left-[15%] transform">
        <Users size={iconSize} style={{ color: dimensionColors.inclusivity }} />
      </div>
    </div>
  );
};

export default DimensionIcons;
