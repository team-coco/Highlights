import React from "react";
import url from "url-parse";
const currentUrl = url();
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import styles from "./app.css";

export default class Highlights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlights: props.highlights,
      itemsToShow: 4
    };
  }

  toggleNumberOfHighlights() {
    if (this.state.itemsToShow === 4) {
      this.setState({ itemsToShow: 8 });
    } else {
      this.setState({ itemsToShow: 4 });
    }
  }

  render() {
    if (this.state.itemsToShow === 4) {
      var innerHTML = "Show more review highlights";
    } else {
      var innerHTML = "Show fewer review highlights";
    }

    const highlights = this.state.highlights;

    const highlightEntries = highlights
      .slice(0, this.state.itemsToShow)
      .map((highlight, index) => {
        let text = highlight.sentence.split(" ");
        let keyWord = highlight.keyword;
        let frequency = highlight.count;
        let photoURL = highlight.photo_url;

        // break each review text into three sections, pre-keyword, keyword, and post keyword.

        let preK = [];
        let k;
        let postK = [];
        let passedKeyword = false;

        // if an image exists with the keyword in its caption, we use that.
        // otherwise, use the user's avatar.

        let isBusinessUrl = highlight.is_business_photo;
        var imageURL = isBusinessUrl
          ? `https://s3-media3.fl.yelpcdn.com/bphoto/${photoURL}/120s.jpg`
          : `https://s3-media4.fl.yelpcdn.com/photo/${photoURL}/120s.jpg`;

        // this is the meat of the prek, k, postk thing from above.
        for (var i = 0; i < text.length; i++) {
          if (text[i].toLowerCase().includes(keyWord)) {
            passedKeyword = true;
            k = " " + text[i] + " ";
            continue;
          } else if (passedKeyword) {
            postK.push(text[i]);
          } else {
            preK.push(text[i]);
          }
        }
        let searchLink = `?q=${keyWord}`;

        return (
          <div className="highlight" key={index}>
            <span>
              <img className="highlight-image" src={imageURL} />
            </span>
            <span className="highlight-text">
              <span>{preK.join(" ")}</span>
              <span className="keyword">
                <a href={searchLink}>{k}</a>
              </span>
              <span>{postK.join(" ")}</span>
              <span className="frequency">
                <a href={searchLink}> in {frequency} reviews</a>
              </span>
            </span>
          </div>
        );
      });

    return (
      <div>
        <div className="allHighlights">
          <CSSTransitionGroup
            transitionName="highlightTransition"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            {highlightEntries}
          </CSSTransitionGroup>
        </div>
        <span>
          <button
            className="num-hightlights-button"
            onClick={this.toggleNumberOfHighlights.bind(this)}
          >
            {innerHTML}
          </button>
        </span>
      </div>
    );
  }
}
