import React, { Component } from 'react';
import moment from 'moment'
import './Home.css';
import axios from 'axios';

const apiKey = '119a8cd72208f21ef0aded801c813c45';

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
        'position': {'coords': {'latitude': 52.2297, 'longitude': 21.0122}},
        'forecast': null,
        'loaded': false,
        'error': false
      };
      this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter(val) {
    this.setState({'loaded': false, 'error': false});
    let th = this;
    axios.get('https://api.openweathermap.org/data/2.5/forecast?APPID='+apiKey+'&q='+val).then(result => {
      const transformed = Object.values(result.data.list);
      th.setState({'forecast': transformed, 'loaded': true})
    }).catch(function (error) {
      th.setState({'error': true});
    });
  }

  componentDidMount() {
    const th = this;
    axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&APPID='+apiKey).then(result => {
      const transformed = Object.values(result.data.list);
      th.setState({'forecast': transformed, 'loaded': true})
    }).catch(function (error) {
      th.setState({'error': true});
    });
  }

  componentWillUnmount() {

  }

  render() {
    const child = this.state.error ? <ErrorMessage>Woops! Something went wrong!</ErrorMessage> : (
      this.state.loaded ? <Forecast forecast={this.state.forecast}/> : <Loader/>
    );
    return (
      <React.Fragment>
        <City onChange={this.handleFilter}/>
        <div className="forecastWrapper">
          {child}
        </div>
      </React.Fragment>
    );
  }
}

class City extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {'value': ''};
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleClick(e) {
    this.props.onChange(this.state.value);
  }

  render() {
    return(
      <div id="searchForm">
        <input id="city" name="city" type="text" value={this.state.value} onChange={this.handleChange}/>
        <button onClick={this.handleClick}>Set</button>
      </div>
    );
  }
}

class Forecast extends Component {
  render() {
    let currentDay = 0;
    const days = this.props.forecast == null ? 'Nothing' : this.props.forecast.map((f) => {
      let convertedDay = moment.unix(f.dt).format('d');
      currentDay = (currentDay === 0 ? convertedDay : currentDay);
      let shouldRender = convertedDay !== currentDay;
      currentDay = convertedDay;
      if(shouldRender)
        return <DayForecast forecast={f} key={f.dt}/>;
      return '';
    }); 

    return (
      <div className='forecastContainer'>
        {days}
      </div>
    );
  }
}

class DayForecast extends Component {
  render() {
    const f = this.props.forecast;
    const arrowRotation = {
      transform: 'rotate('+f.wind.deg+'deg)'
    }
    return (
      <div className="dayForecast">
        <div className="weekDay">{moment.unix(f.dt).format('dddd')}</div>
        <img src={"images/"+f.weather[0].icon+".png"} alt=""/>
        {f.weather[0].description}
        <div className="data">
          <div className="temppressure">{(f.main.temp-273.15).toFixed(0)}<span className="desc">{(f.main.pressure).toFixed(0)} hPa</span></div>
          <div className="wind"><img src="images/wind.png" className="windIcon" style={arrowRotation} alt=""/>{f.wind.speed} km/h</div>
          <div className="humidity">{f.main.humidity}%</div>
        </div>
      </div>
    );
  }
}

class Loader extends Component {
  render() {
    return (
      <div className="loader"></div>
    );
  }
}

class ErrorMessage extends Component {
  render() {
    return (
      <div className="message warning">{this.props.children}</div>
    );
  }
}

export default Home;
