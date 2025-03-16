
import { common } from './common';
import { header } from './header';
import { auth } from './auth';
import { assessment } from './assessment';
import { tabs } from './tabs';
import { results } from './results';
import { dimensions } from './dimensions';
import { activities } from './activities';

// Combine all translation modules
export const zh = {
  ...common,
  ...header,
  ...auth,
  ...assessment,
  ...tabs,
  ...results,
  ...dimensions,
  ...activities
};
