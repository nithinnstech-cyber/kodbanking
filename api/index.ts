import serverless from 'serverless-http';
// Import the compiled backend entry (ensure backend is built before deployment)
import app from '../backend/dist/index';

const handler = serverless((app as any));

export default handler;
