import React, { Component } from "react";

class HolidayLists extends Component {

    renderTableHeader() {
        return <th colSpan="3">{this.props.data.month.toUpperCase()}</th>
    }
   
    renderTableData() {
        return this.props.data.holiday.map((v, i) => {
            return (
                <tr key={i}>
                    <td>{v.date}</td>
                    <td>{v.type}</td>
                    <td>{v.name}</td>
                    {/* <td>{v.description}</td> */}
                </tr>
            )
        })
    }

    render() {
        return (
            <tbody>
                <tr>{this.renderTableHeader()}</tr>
                {this.renderTableData()}
            </tbody>
        )
      }
}

export default HolidayLists;