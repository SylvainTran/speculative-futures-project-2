import React, { Component } from 'react';

class ContentItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content-item">
        {/* Project highlights video and hero pics */}
        <div className="is-flex flex-vertical">
          <video width="512" height="512" controls>
            <source src="assets/x.mp4" type="video/mp4" />
            <source src="assets/x.ogg" type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          <div className="content-item-pics is-flex flex-horizontal">
            <img src="" alt="content-item-pic-a" />
            <img src="" alt="content-item-pic-b" />
            <img src="" alt="content-item-pic-c" />
          </div>
        </div>
        {/* Description on the side */}
        <article className="content article-description">
          <h1>{this.props.name}</h1>
          <br />
          <h8>{this.props.summary}</h8>

          <br /><br />
          <p>
            Story:
              {this.props.story}
          </p>

          <br />
          <p>
            Contributor:
              {this.props.signature}
          </p>

          <br />

          {this.props.gameMaterials? <p>
            Materials: {this.props.materials}
          </p> : null}

          {this.props.hasPlayLink? <a href={this.props.playLink}>Play User Contributed Fragment</a> : null}
          <br /><br />
          <input type="checkbox" id={this.props.id} name={this.props.name} value={this.props.name} />
          <label for={this.props.name}> Mark as Played </label><br />

        </article>
      </div>
    );
  }
}

export default ContentItem;
