import React, { Component } from "react";
import HolidayTable from './HolidayTable';

class HolidayLists extends Component {
  
  render() {
    console.log(this.props.holidaysData);
    const holidaysDataItems = this.props.holidaysData.map((item, index) =>
        <HolidayTable data={item} key={index}/>
    );
     return (
          <table id='holidayTable'>
              {holidaysDataItems}
          </table>
     )
  }
}

export default HolidayLists;