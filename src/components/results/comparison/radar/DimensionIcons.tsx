
import React from 'react';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { dimensionColors } from '../../development/DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface DimensionIconsProps {
  iconSize: number;
}

const DimensionIcons: React.FC<DimensionIconsProps> = ({ iconSize }) => {
  const isMobile = useIsMobile();
  
  // Improved positioning to avoid overlapping with chart labels
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top (Humility) - Moved up */}
      <div className="absolute top-[8%] left-[50%] transform -translate-x-1/2">
        <Gauge size={iconSize} style={{ color: dimensionColors.humility }} />
      </div>
      
      {/* Top Right (Empathy) - Moved further right */}
      <div className="absolute top-[25%] right-[10%] transform">
        <HeartHandshake size={iconSize} style={{ color: dimensionColors.empathy }} />
      </div>
      
      {/* Bottom Right (Accountability) - Moved further right */}
      <div className="absolute bottom-[25%] right-[10%] transform">
        <ChartNoAxesCombined size={iconSize} style={{ color: dimensionColors.accountability }} />
      </div>
      
      {/* Bottom (Resiliency) - Moved down */}
      <div className="absolute bottom-[8%] left-[50%] transform -translate-x-1/2">
        <TreePalm size={iconSize} style={{ color: dimensionColors.resiliency }} />
      </div>
      
      {/* Bottom Left (Transparency) - Moved further left */}
      <div className="absolute bottom-[25%] left-[10%] transform">
        <Blend size={iconSize} style={{ color: dimensionColors.transparency }} />
      </div>
      
      {/* Top Left (Inclusivity) - Moved further left */}
      <div className="absolute top-[25%] left-[10%] transform">
        <Users size={iconSize} style={{ color: dimensionColors.inclusivity }} />
      </div>
    </div>
  );
};

export default DimensionIcons;
