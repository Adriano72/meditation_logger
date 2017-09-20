import React, { Component } from 'react';

class SessionsCreate extends Component {
  onCreateClick() {
    console.log("Ciao");
  }

  render() {
    return (
      <div className="sessions-create">
        <div className="input-group">
          <input ref="date" className="form-control" />
          <div className="input-group-btn">
            <button
              onClick={this.onCreateClick.bind(this)}
              className="btn btn-default">
              Share Bin
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SessionsCreate;
