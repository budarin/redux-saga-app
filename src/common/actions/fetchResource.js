import createAction from '../utils/createAction';

export const FETCH_RESOURCE = '@fetch/RESOURCE';

const fetchResource = createAction(FETCH_RESOURCE, 'url');

export default fetchResource;
