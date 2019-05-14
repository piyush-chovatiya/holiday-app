import React, { Component } from "react";
import HolidayTable from './HolidayTable';

class HolidayLists extends Component {
  
  render() {
    //console.log(this.props.holidaysData);
    const holidaysDataItems = this.props.holidaysData.map((item, index) =>
        <HolidayTable data={item} key={index}/>
    );
     return (
         <div>
            <h2 id='subTitle'>{this.props.country} (Year {this.props.year}) Holiday List</h2>
            <table id='holidayTable'>
                {holidaysDataItems}
            </table>
          </div>
     )
  }
}

export default HolidayLists;