
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
          Skill Development Activities
        </h3>
        <p className="text-indigo-700 mt-1">
          Choose from targeted activities to improve your HEARTI leadership dimensions. We recommend focusing on your development area: 
          <strong className="uppercase"> {focusDimension}</strong>
        </p>
      </div>
      
      <SkillDevelopment focusDimension={focusDimension} />
    </div>
  );
};

export default DevelopmentTab;
