'use strict';

function examItem(Id, enrolled, booked, registered) {
    this.Id = Id;
    this.enrolled = enrolled;
    this.booked = booked;
    this.registered = registered;
  }

module.exports = examItem;