import {
  faCreditCard,
  faFighterJet,
  faFlag,
  faList,
  faSun,
  faTint,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';

export default {
  all: {
    text: 'All Holdings',
    icon: faList,
  },
  military: {
    text: 'Military',
    icon: faFighterJet,
    harmful: true,
  },
  oil: {
    text: 'Oil & Gas',
    icon: faTint,
    harmful: true,
  },
  mining: {
    text: 'Mining & Extraction',
    icon: faWrench,
    harmful: true,
  },
  alternative: {
    text: 'Alternative Energy',
    icon: faSun,
  },
  banking: {
    text: 'Banking & Financials',
    icon: faCreditCard,
  },
  palestine: {
    text: 'Palestine Occupation',
    icon: faFlag,
    harmful: true,
  },
};
