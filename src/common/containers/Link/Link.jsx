import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Link from '../../componets/Link/Link.jsx';
import navigateTo from '../../actions/navigateTo';

const mapDispatchToActions = dispatch => ({
    onClick: bindActionCreators(navigateTo, dispatch),
});

export default connect(null, mapDispatchToActions)(Link);
