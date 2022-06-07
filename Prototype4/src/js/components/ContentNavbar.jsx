import React, { Component } from 'react';

class ContentNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  updateContentSelectionTags(selectedContentItem) {
    console.log("Clicked on " + selectedContentItem);
    this.props.updateContentSelectionTags(selectedContentItem);
  }

  render() {
    return (
      <div>
        <br/>
        <nav>
          <button className="button is-primary" onClick={this.updateContentSelectionTags.bind(this, "All")}>All</button>
          <button className="button is-secondary" onClick={this.updateContentSelectionTags.bind(this, "Library")}>Library</button>
          <button className="button is-secondary" onClick={this.updateContentSelectionTags.bind(this, "Alone")}>Alone</button>
          <button className="button is-secondary" onClick={this.updateContentSelectionTags.bind(this, "Learning!")}>Learning</button>
          <button className="button is-secondary" onClick={this.updateContentSelectionTags.bind(this, "Discouraged")}>Discouraged</button>
          <button className="button is-secondary" onClick={this.updateContentSelectionTags.bind(this, "Driving")}>Driving</button>
        </nav>
        <br/>
      </div>);
  }
}

export default ContentNavbar;
