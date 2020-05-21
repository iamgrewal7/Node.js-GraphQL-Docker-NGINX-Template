import fs from 'fs';
import path from 'path';

import { resolvers } from './resolvers';

const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
export { schema, resolvers };
