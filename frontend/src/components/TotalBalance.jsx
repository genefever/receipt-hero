import React, { useContext } from "react";
import { ThemeContext } from "styled-components";

function TotalBalance(props) {
  const themeContext = useContext(ThemeContext);

  function generateTotalBalance(props) {
    // If there are only two people, only display one message of who owes what.
    if (props.calculationObject.people.length === 2) {
      let self = props.calculationObject.people[0];
      let otherPerson = props.calculationObject.people[1];

      if (self.totalAmount > 0) {
        return (
          <h6 style={{ color: themeContext.cellColorGreen }}>
            {otherPerson.name} owes you $
            {Math.abs(otherPerson.totalAmount).toFixed(2)}
          </h6>
        );
      } else if (otherPerson.totalAmount > 0) {
        return (
          <h5 style={{ color: themeContext.cellColorOrange }}>
            You owe {otherPerson.name} ${Math.abs(self.totalAmount).toFixed(2)}
          </h5>
        );
      }

      return null;
    }
  }

  return props.calculationObject.receipts.length ? (
    <div>
      <h4>Total balance:</h4>
      {generateTotalBalance(props)}
    </div>
  ) : null;
}

export default TotalBalance;
