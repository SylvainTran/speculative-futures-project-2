import { React } from 'react';
import '../css/main.css';
import '../css/style.css';

const app = document.getElementById('app');

//TODO: JSON
// MentalRay's user contributed database of experiences to share
// A user contributed fragment data
// Can be mixed between different people to benefit from their experiences as well? Direct Experience Share Link (tm)
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

function App() {
    return (
      <div>
        <React.StrictMode>
          <HomePage />
        </React.StrictMode>
      </div>
    );
}

export default App;
