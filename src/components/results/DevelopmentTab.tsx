
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Award } from 'lucide-react';
import SkillDevelopment from '../SkillDevelopment';

interface DevelopmentTabProps {
  focusDimension: HEARTIDimension;
  topStrength: HEARTIDimension;
}

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension, topStrength }) => {
  return (
    <div className="mb-4">
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6 rounded-md">
        <h3 className="font-medium flex items-center gap-2 text-indigo-800">
          <Award className="text-indigo-600" size={20} />
          Development Recommendations
        </h3>
        <p className="text-indigo-700 mt-1">
          Select behaviors below that balance your leadership profile. We recommend including:
        </p>
        <ul className="list-disc ml-5 text-indigo-700 mt-2">
          <li>Behaviors from your strength area: <strong className="uppercase">{topStrength}</strong></li>
          <li>Behaviors from your development area: <strong className="uppercase">{focusDimension}</strong></li>
        </ul>
        <p className="text-indigo-700 mt-2 text-sm">
          Choose a total of 3 behaviors and practice each 21 times to form lasting habits.
        </p>
      </div>
      
      <SkillDevelopment focusDimension={focusDimension} topStrength={topStrength} />
    </div>
  );
};

export default DevelopmentTab;
