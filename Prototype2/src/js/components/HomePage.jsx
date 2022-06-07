import React, { Component } from 'react';
import UserProgressBar from './UserProgressBar.jsx';
import ProfileBusinessCard from './ProfileBusinessCard.jsx';
import UserFragmentSection from './UserFragmentSection.jsx';
import ContentNavbar from './ContentNavbar.jsx';
import ContentItem from './ContentItem.jsx';

let BlueBook = [
  {
    id: 1,
    name: " At the library",
    tags: ["All", "Library", "Data Entry", "Alone"],
    summary: " I was alone at the library, working data entry.",
    story: " I didn't like the idea of working on Saturday, on top of every other weekday, doing insurance. But I needed the money. They made me scour databases of patient data. I'm supposed to be entering data now.",
    signature: " John Thorpe, Research Assistant",
    memo: ["Remember the folk", "Blue Book"],
    materials: "For this part of the game, I wanted to reify/alter/recreate a memory that I had a few years ago, and put them in the game, and allow the user to play around with them/my own memory's objectivity/objective materials.",
    reflection: null,
    hasPlayLink: true,
    playLink: "#insert unity embed here"
  },
  {
    id: 2,
    name: " Space bathroom thoughts again",
    tags: ["All", "Spaceship", "Bathroom", "Alone", "Thinking"],
    summary: " I was thinking on the toilet seat after duty. I saw the moon through the window and started thinking about my life.",
    story: " I don't know how it was supposed to have gone. Did I say the wrong thing to the right person, or the right thing to the wrong person? Or perhaps this was another one of these things that is determined in advance?",
    signature: " Ben Culus, Spaceship engine operator",
    memo: ["Diamond Sky"],
    materials: "I just thought it'd be funny (of the scatological kind) to visualize a character sitting on the toilet seat in space, philosophizing about something.",
    reflection: null,
    hasPlayLink: true,
    playLink: "#insert unity embed here"
  },
  {
    id: 3,
    name: " Alone driving",
    tags: ["All", "Alone", "Driving", "Romance"],
    summary: " He didn't answer my text back.",
    story: " Where am I going? When is he going to answer me back? Please, just say anything...",
    signature: " Ari Curry, Full-Time Teenager",
    memo: ["Purple Love"],
    materials: "For this one, I might have recalled something from long ago.",
    reflection: null,
    hasPlayLink: true,
    playLink: "#insert unity embed here"
  }
];

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {contentSelectionTags: ["All"]};
    this.updateContentSelectionTags = this.updateContentSelectionTags.bind(this);

    // Setup initial portfolio display items
    this.getAllContentItems = this.getAllContentItems.bind(this);
  }

  getAllContentItems() {
    // TODO: READ FROM JSON
    return BlueBook;
  }

  contentTagDeselection(index) {

    let beforeIndex = this.state.contentSelectionTags.slice(0, index);
    let afterIndex = this.state.contentSelectionTags.slice(index);
    let singleTag = beforeIndex.length === 0;

    if (singleTag) {
      this.setState({contentSelection: []});
      return;
    }

    let deselected = beforeIndex.concat(afterIndex);

    this.setState({
      contentSelection: deselected
    });

    // console.log("After deselection: " + deselected);
  }

  updateContentSelectionTags(criteriaString) {

    // console.log("criteria string: " + criteriaString);

    const isAlreadySelected = (itemObject) => {
      return itemObject.tags.includes(criteriaString);
    }

    let selectIndex = this.getAllContentItems().findIndex(isAlreadySelected);

    if (selectIndex > -1) {
      console.log("Found selected criteriaString!");
      // deselect instead
      this.contentTagDeselection(selectIndex);
    }
    else if (selectIndex === -1) {
      console.log("Did not find criteriaString already selected!");
      // Add to selection array
      let curr = this.state.contentSelectionTags.slice(0);
      console.log("Curr: " + curr);
      curr.push(criteriaString);

      console.log("Curr after: " + curr);
      this.setState({contentSelectionTags: curr});
    }
  }

  render() {
    let selectedContentTags = this.state.contentSelectionTags;
    let allContentItems = this.getAllContentItems();
    let selectedContentItems = [];

    selectedContentTags.forEach( tag => {

      console.log("Criteria: " + tag);

      allContentItems.forEach( itemObject => {

        if (itemObject.tags.includes(tag)) {
          selectedContentItems.push(itemObject);
        }
      })
    });

    return (
      <div className="global-container content">
        {/* Selection work that have the criterias as tag */}
        <UserProgressBar />
        <ProfileBusinessCard />
        <div>
          <h1>MentalRay</h1>
          <h7>Global therapeutic experiences for everyone to share and learn, everywhere in the galaxy using Frag.Net.</h7>
          {/*<h8>Discuss Progress with Certified MentalRay Specialist?</h8>*/}

        </div>
        <h1>My Learning Pathway: CBT</h1>
        <h1>Unification: 0%</h1>
        <h5>Next milestone: Unlock Frag.Net access by completing 3 tasks.</h5>
        <progress className="progress is-link" value="1" max="100">1%</progress>

        <ContentNavbar updateContentSelectionTags={this.updateContentSelectionTags} />
        {/* Gallery of all selected portfolio items UserFragmentSection*/}
        <h1>Core Concepts: Automatic Thoughts</h1>
        <h7><em>Suggested Action: Browse and mark as completed these user contributed experiences.</em></h7><br /><br />
        {selectedContentItems.length > 0 ?
          <UserFragmentSection selectedContentItems={selectedContentItems} /> : null}
      </div>
    );
  }
}


export default HomePage;
