import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import Snackbar from 'material-ui/Snackbar';
import {connect} from 'react-redux';

import {closeSnackbar} from '../../modules/viewReducer';

class SnackbarWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleRequestClose() {
    this.props.actions.closeSnackbar();
  }

  render() {
    const snackTypes = {
      success : {
        backgroundColor : '#16a461',
        color           : 'white'
      },
      error : {
        backgroundColor : '#d9152a',
        color           : 'white'
      }
    };
    return (
      <Snackbar
        open={!!this.props.snackbar.message}
        message={this.props.snackbar.message}
        autoHideDuration={this.props.snackbar.autoHideDuration}
        onRequestClose={this.handleRequestClose}
        bodyStyle={snackTypes[this.props.snackbar.snackType]}
      />
    );
  }
}

SnackbarWrapper.propTypes = {
  snackbar : PropTypes.object.isRequired,
  actions  : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    snackbar : state.view.snackbar
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators({closeSnackbar}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SnackbarWrapper);
