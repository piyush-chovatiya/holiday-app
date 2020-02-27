import React, { Component } from 'react';
import HolidayLists from './HolidayLists';

import _ from 'lodash';
import loader from '../assets/loader.gif';

//const countryCodes = [{'us' : 'Unites States'}, {'gb' : 'Great Britain'}, {'fr' : 'France'}, {'de' : 'Germany'}, {'id' : 'Indonesia'}];

export default class HolidayForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            country: '',
            year: '',
            selcountry: '',
            selyear: '',
            isLoading: false,
            isLoaded: false,
            isDataEmpty: null,
            error: null,
            //rawHolidayList: [],
            filteredHolidayList: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    

    handleChange(event) {
        const name = event.target.name;
        const selName = 'sel' + event.target.name;

        this.setState({
            [name]: event.target.value,
            [selName]: event.target.options[event.target.selectedIndex].text
        });

        //console.log([selName] +' : '+ event.target.options[event.target.selectedIndex].text);
    }
    

    handleSubmit(event) {
        event.preventDefault();
        this.fetchHolidays();
    }

    //function to filter the json data
    filterList(data) {

        //console.log('data : ' + data);
        let isEmpty = (data === undefined) ? true : false;
        this.setState({
            isDataEmpty: isEmpty
        })
        //console.log(this.state.isDataEmpty);

        let newArr = [];
        data.forEach((dataitem) => {
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

        //console.log(newArr);

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

    //api call on the click of submit button
    fetchHolidays() {
        const holidayUrl = 'https://calendarific.com/api/v2/holidays?api_key=eb00d5d925e8a5428754bcbdef9a88f327a921c4&country=' + this.state.country + '&year=' + this.state.year;

        console.log(holidayUrl);
        this.setState({
            isLoading: true
        });

        fetch(holidayUrl)
          .then(response => response.json())
          .then(
            data => {
                //function call to filter data
                this.filterList(data.response.holidays)
                this.setState({
                    isLoading: false,
                    isLoaded: true
                })
            }
          )
          .catch(error =>  this.setState({error: true, isDataEmpty: true, isLoading: false, isLoaded: false}) );
    }

    render() {
        const loaderImg = this.state.isLoading ? <img className="loader" src={loader} alt='' /> : null;

        const errorMsg = this.state.isDataEmpty ? <p className="emptyMsg">There are no Holidays details available for current selection.</p> : null;

        let maxOffset = 99, startYear = 1950;
        let allYears = [];
        for(let x = 0; x <= maxOffset; x++) {
            allYears.push(startYear + x)
        }
        const yearList = allYears.map((x) => {return(<option key={x}>{x}</option>)});
        return (
            <div>
                <h1 id='title'>Holiday App</h1>
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Select Your Country:
                            <select name="country" id="country" value={this.state.country} onChange={this.handleChange}>
                                <option value="">---Select Country ---</option>
                                <option value="in">India</option>
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
                                {yearList}
                            </select>
                        </label>
                        <input type="submit" value="Submit" className="btn"/>
                    </form>
                    {loaderImg}
                    {errorMsg}
                    {this.state.isLoaded && !this.state.isLoading && (this.state.filteredHolidayList !== undefined) && 
                        <HolidayLists holidaysData={this.state.filteredHolidayList} country={this.state.selcountry} year={this.state.selyear} />}
                </div>
                
            </div>
        );
    }
}