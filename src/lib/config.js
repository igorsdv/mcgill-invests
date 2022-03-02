import { readFileSync } from 'fs';
import yaml from 'yaml';

function readConfig(file) {
  return yaml.parse(readFileSync(`config/${file}.yml`, 'utf8'));
}

function prepareRegexes({ replace, tickerSuffixes, ...props }) {
  for (const field of Object.keys(replace)) {
    replace[field] = replace[field].map(({ search, ...props }) => ({
      search: new RegExp(search),
      ...props,
    }));
  }

  tickerSuffixes.regex = new RegExp(tickerSuffixes.regex);

  return {
    replace,
    tickerSuffixes,
    ...props,
  };
}

const definitions = readConfig('definitions');
const transforms = prepareRegexes(readConfig('transforms'));

export function getDefinedViews() {
  return Object.keys(definitions).filter((view) => view !== 'exclude');
}

function matches(object, fields) {
  return Object.entries(fields).some(([field, values]) =>
    values.includes(object[field])
  );
}

export function matchesView(object, view) {
  return matches(object, definitions[view]);
}

function applyReplace(object) {
  for (const [field, values] of Object.entries(transforms.replace)) {
    for (const { match, search, replacement } of values) {
      if (match === undefined || matches(object, match)) {
        object[field] = object[field].replace(search, replacement);
      }
    }
  }

  return object;
}

function applyTickerSuffixes(object) {
  const { regex, suffixes } = transforms.tickerSuffixes;

  if (
    suffixes[object['country']] !== undefined &&
    regex.test(object['ticker'])
  ) {
    object['ticker'] += suffixes[object['country']];
  }

  return object;
}

function applyTickerMap(object) {
  const { tickerMap } = transforms;

  if (tickerMap[object['ticker']] !== undefined) {
    object['ticker'] = tickerMap[object['ticker']];
  }

  return object;
}

export function applyTransforms(object) {
  object = applyReplace(object);
  object = applyTickerSuffixes(object);
  object = applyTickerMap(object);

  return object;
}
