import React, { Component } from 'react';

class UserManual extends React.Component {

  constructor(props) {
    super(props);
    this.state = {readManual: false};
  }

  render() {

    return (
      <div className="global-container content">
        <h7><em>Suggested Action: Complete all the forms.</em></h7><br /><br />
      </div>
    );
  }
}

export default UserManual;
