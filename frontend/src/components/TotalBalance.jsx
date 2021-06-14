import React from "react";

function TotalBalance(props) {
  // If there are only two people, only display one message of who owes what.
  if (props.calculationObject.people.length === 2) {
    let self = props.calculationObject.people[0];
    let otherPerson = props.calculationObject.people[1];

    if (self.totalAmount > 0) {
      return (
        <p>
          {otherPerson.name} owes you $
          {Math.abs(otherPerson.totalAmount).toFixed(2)}
        </p>
      );
    } else if (otherPerson.totalAmount > 0) {
      return (
        <p>
          You owe {otherPerson.name} ${Math.abs(self.totalAmount).toFixed(2)}
        </p>
      );
    }

    return null;
  }
}

export default TotalBalance;
