
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Award } from 'lucide-react';
import SkillDevelopment from '../SkillDevelopment';

interface DevelopmentTabProps {
  focusDimension: HEARTIDimension;
}

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension }) => {
  return (
    <div className="mb-4">
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6 rounded-md">
        <h3 className="font-medium flex items-center gap-2 text-indigo-800">
          <Award className="text-indigo-600" size={20} />
          Development Recommendations
        </h3>
        <p className="text-indigo-700 mt-1">
          Choose 3 behaviors below that will help strengthen your leadership dimensions. We recommend focusing on your development area: 
          <strong className="uppercase"> {focusDimension}</strong>
        </p>
        <p className="text-indigo-700 mt-2 text-sm">
          Practice each behavior 30 times to develop a new habit and master the skill.
        </p>
      </div>
      
      <SkillDevelopment focusDimension={focusDimension} />
    </div>
  );
};

export default DevelopmentTab;
