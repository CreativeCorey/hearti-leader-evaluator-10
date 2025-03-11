
import React from 'react';
import { Gauge, HeartHandshake, Goal, TreePalm, Blend, Users } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { dimensionColors } from '@/components/results/development/DimensionIcons';

interface DimensionIconProps {
  dimension: HEARTIDimension;
  size?: number;
}

const DimensionIcon: React.FC<DimensionIconProps> = ({ dimension, size = 24 }) => {
  switch(dimension) {
    case 'humility': return <Gauge size={size} style={{ color: dimensionColors.humility }} />;
    case 'empathy': return <HeartHandshake size={size} style={{ color: dimensionColors.empathy }} />;
    case 'accountability': return <Goal size={size} style={{ color: dimensionColors.accountability }} />;
    case 'resiliency': return <TreePalm size={size} style={{ color: dimensionColors.resiliency }} />;
    case 'transparency': return <Blend size={size} style={{ color: dimensionColors.transparency }} />;
    case 'inclusivity': return <Users size={size} style={{ color: dimensionColors.inclusivity }} />;
    default: return null;
  }
};

export default DimensionIcon;
