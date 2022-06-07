import React, { Component } from 'react';

function ProfileBusinessCard() {
  return (
    <div className="is-flex flex-start-end">
      <div className="is-flex flex-vertical">
        <a src="usermanual.html">User Manual</a>
        <a src="#">Courses</a>
        <a src="#">My Cart (user only)</a>
        <a src="#">My Dashboard (user only)</a>
        <a src="#">My Account Information (user only)</a>
        <a src="#">Logout (user only)</a>
      </div>
    </div>);
}

export default ProfileBusinessCard;
