import { connect } from 'react-redux';

import Layout from '../../componets/Layout/Layout.jsx';

const mapStateToProps = state => ({
    currentRouter: state.currentRouter,
});

export default connect(mapStateToProps)(Layout);
