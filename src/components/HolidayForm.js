import React, { Component } from 'react';
import HolidayLists from './HolidayLists';

import _ from 'lodash';

export default class HolidayForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            country: '',
            year: '',
            isLoading: false,
            isLoaded: false,
            error: null,
            rawHolidayList: [],
            filteredHolidayList: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        const name = event.target.name;

        this.setState({
            [name]: event.target.value
        });

        console.log([name] + ':' + event.target.value)
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.fetchHolidays();
    }

    filterList(data) {

        let newArr = [];
        _.each(data, function (dataitem) {
            let obj = {
                name: dataitem.name,
                description: dataitem.description,
                date: dataitem.date.iso,
                day: dataitem.date.datetime.day,
                month: '',
                year: dataitem.date.datetime.year,
                type: dataitem.type[0]
            };
            let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
            obj.month = months[dataitem.date.datetime.month - 1];
            newArr.push(obj);
        });

        const result = _.chain(newArr)
            .groupBy("month")
            .toPairs()
            .map(function(currentData){
            return _.zipObject(["month", "holiday"], currentData);
            })
            .value();

        this.setState({
            filteredHolidayList: result
        });

        console.log(this.state.filteredHolidayList);
      }

    fetchHolidays() {
        const holidayUrl = 'https://calendarific.com/api/v2/holidays?api_key=eb00d5d925e8a5428754bcbdef9a88f327a921c4&country=' + this.state.country + '&year=' + this.state.year;

        console.log(holidayUrl);

        this.setState({
            isLoading: true
        });

        fetch(holidayUrl)
          .then(response => response.json())
          .then(
            data =>
              this.setState({
                rawHolidayList: data.response.holidays,
                isLoading: false,
                isLoaded: true
              })
          )
          .catch(error => this.setState({ error, isLoading: false, isLoaded: false }));

          //console.log(this.state.rawHolidayList);
          //console.log(this.state.isLoading);
            
          //function to process data
          this.filterList(this.state.rawHolidayList);
    }

    render() {
        const loader = this.state.isLoading ? <img src={'../assets/loader.gif'} alt='' /> : null;
        return (
            <div>
                <h1 id='title'>Holiday App</h1>
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Select Your Country:
                            <select name="country" id="country" value={this.state.country} onChange={this.handleChange}>
                                <option value="">---Select Country ---</option>
                                <option value="us">Unites States</option>
                                <option value="gb">Great Britain</option>
                                <option value="fr">France</option>
                                <option value="de">Germany</option>
                                <option value="id">Indonesia</option>
                            </select>
                        </label>
                        <label>
                            Select Year:
                            <select name="year" id="year" value={this.state.year} onChange={this.handleChange}>
                                <option value="">---Select Year ---</option>
                                <option value="2010">2010</option>
                                <option value="2014">2014</option>
                                <option value="2016">2016</option>
                                <option value="2019">2019</option>
                            </select>
                        </label>
                        <input type="submit" value="Submit" className="btn"/>
                    </form>
                    <img src={'../assets/loader.gif'} alt='' />
                    {loader}
                    {this.state.isLoaded && (this.state.filteredHolidayList!== undefined) && 
                        <HolidayLists holidaysData={this.state.filteredHolidayList} />}
                </div>
                
            </div>
        );
    }
}