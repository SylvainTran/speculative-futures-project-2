import React, { Component } from 'react';
import ContentItem from './ContentItem.jsx'

class UserFragmentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedContentItems: props.selectedContentItems}
  }

  render() {
    const selectedContentItems = this.state.selectedContentItems;

    return (
      <section className="full-width">
        {selectedContentItems.map(itemObject => {
          return (
            <div key={itemObject.name}>
              <ContentItem id={itemObject.id} name={itemObject.name} summary={itemObject.summary} story={itemObject.story} signature={itemObject.signature} materials={itemObject.materials} hasPlayLink={itemObject.hasPlayLink} />
              <br /><br />
            </div>);
        })}
      </section>);
    }
}

export default UserFragmentSection;
