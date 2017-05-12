import createAction from '../utils/createAction';

export const START_NAVIGATE_TO = '@start_navigate/TO';
export const NAVIGATE_TO = '@navigate/TO';

const navigateTo = createAction(START_NAVIGATE_TO, 'url');

export default navigateTo;
