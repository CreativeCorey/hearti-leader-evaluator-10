
import React from 'react';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { dimensionColors } from '../../development/DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface DimensionIconsProps {
  iconSize: number;
}

const DimensionIcons: React.FC<DimensionIconsProps> = ({ iconSize }) => {
  const isMobile = useIsMobile();
  
  // Add extra spacing for positions to avoid crowding on mobile devices
  const topPosition = isMobile ? '10%' : '15%';
  const bottomPosition = isMobile ? '10%' : '15%';
  const sidePosition = isMobile ? '12%' : '15%';
  const topSideTop = isMobile ? '22%' : '25%';
  const bottomSideTop = isMobile ? '22%' : '25%';
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top (Humility) */}
      <div className={`absolute top-[${topPosition}] left-[50%] transform -translate-x-1/2`}>
        <Gauge size={iconSize} style={{ color: dimensionColors.humility }} />
      </div>
      
      {/* Top Right (Empathy) */}
      <div className={`absolute top-[${topSideTop}] right-[${sidePosition}] transform`}>
        <HeartHandshake size={iconSize} style={{ color: dimensionColors.empathy }} />
      </div>
      
      {/* Bottom Right (Accountability) */}
      <div className={`absolute bottom-[${bottomSideTop}] right-[${sidePosition}] transform`}>
        <ChartNoAxesCombined size={iconSize} style={{ color: dimensionColors.accountability }} />
      </div>
      
      {/* Bottom (Resiliency) */}
      <div className={`absolute bottom-[${bottomPosition}] left-[50%] transform -translate-x-1/2`}>
        <TreePalm size={iconSize} style={{ color: dimensionColors.resiliency }} />
      </div>
      
      {/* Bottom Left (Transparency) */}
      <div className={`absolute bottom-[${bottomSideTop}] left-[${sidePosition}] transform`}>
        <Blend size={iconSize} style={{ color: dimensionColors.transparency }} />
      </div>
      
      {/* Top Left (Inclusivity) */}
      <div className={`absolute top-[${topSideTop}] left-[${sidePosition}] transform`}>
        <Users size={iconSize} style={{ color: dimensionColors.inclusivity }} />
      </div>
    </div>
  );
};

export default DimensionIcons;
