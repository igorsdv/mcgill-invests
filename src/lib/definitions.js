import { readFileSync } from 'fs';
import yaml from 'yaml';

export default yaml.parse(readFileSync('data/definitions.yml', 'utf8'));
