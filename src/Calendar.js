import React, { Component } from 'react';
import { createStore } from 'redux'
import {connect} from 'react-redux'




class Calendar extends Component {
  constructor() {
    super();

    this.state = {
      data: JSON.parse(localStorage.getItem('storage')),
      isActive: false
    };
  }



  reducer(state = [], action) {
    console.log(action);
    return state;
  }


  buildHours(props) {
    let hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(false)
    }
    let chosen = this.getChosenHours(props);
    chosen.forEach(i => {
      hours[i] = true;
    });
    return hours;
  }

  getChosenHours(props) {
    let arr = [];
    props.map(y => {
      let bt = y['bt']/60;
      let et = (y['et']+ 1)/60 ;
      return [bt, et]
    }).forEach(p => {
      for (;p[0] < p[1]; p[0]++) {
        arr.push(p[0]);
      }
    });
    return arr;
  }

  setFirst(e) {
    let current = e.target;
    current.classList.add('start');
    current.classList.add('hover-span');
    this.setState({
      isActive: true
    })
  }

  dropToFinal(e) {
    let current  = e.target,
        start    = document.querySelector('.start'),
        bt       = +start.getAttribute('data-count'),
        et       = +current.getAttribute('data-count'),
        children = [...start.parentNode.children];
    
    if (bt <= et ) this.fillHovered(children, bt, et);
    else if (bt > et) this.fillHovered(children, et, bt);
  }

  setFinal(e) {
    let start = document.querySelector('.start');
    if (!start) {
      this.lastFocus();
      return null
    }
    let parent = start.parentNode;
    let day = parent.parentNode.getAttribute('data-day');

    let choosen = [...parent.querySelectorAll('.hover-span')];

    if (choosen.length !== 0) {
      let first = +choosen[0].getAttribute('data-count') ,
          last  = +choosen[choosen.length - 1].getAttribute('data-count') ;

      this.props.store[day].push(this.hoursToMinutes(first, last))
      this.props.setData(this.props.store);


      
      this.lastFocus();
      
    }
  }
  
  removeClassFromPage(classN) {
    let classes = [...document.querySelectorAll('.' + classN)];
    if (classes) {
      classes.forEach(i => {
        i.classList.remove(classN);
      })
    }
  }

  fillHovered(arr, bt, et) {
    arr.forEach((el, i) => {
      if (i >= bt && i <=et) el.classList.add('hover-span');
      else el.classList.remove('hover-span');
    })
  }

  lastFocus(e) {
    this.removeClassFromPage('start');
    this.removeClassFromPage('hover-span');
    this.setState({
      isActive: false
    })
  }
  
  hoursToMinutes(bt, et) {
    let obj = {};
    obj.bt = bt * 60;
    obj.et = (et * 60) + 1 ;
    return obj;
  }

  setAllDay(e) {
    let parent = e.target.parentNode;
    let day = parent.getAttribute('data-day');
    if (parent.querySelector('[data-chosen=false]')) {
      this.props.store[day][0] = this.hoursToMinutes(0,23);
    } else {
      this.props.store[day] = [];    
    }

    this.props.setData(this.props.store);
    

  }

  

  clearAll(e) {
    e.preventDefault();
    Object.keys(this.props.store).forEach(i => {
      this.props.store[i] = [];
    });
    this.props.setData(this.props.store);
  }

  filterData(day) {
    let data = this.props.store[day];
    data.forEach( (i,x) => {
      data.forEach( (y,z) => {
        let s1 = i['bt'],
            s2 = y['bt'],
            e1 = i['et'],
            e2 = y['et'];
        if (s1 > s2 && e1 < e2) {
          data.splice(x,1)
        } else if (s1 < s2 && e1 < e2 && e1 > s2) {
          y['bt'] = i['bt'];
          data.splice(x,1)  
        }
      });
    })
  }

  saveAll(e) {
    e.preventDefault();
    Object.keys(this.props.store).forEach(i => {
      this.filterData(i);
    })
    Object.keys(this.props.store).forEach(i => {
      this.filterData(i);
    })
    this.props.setData(this.props.store);
    localStorage.setItem('storage', JSON.stringify(this.props.store));    
  }

  render() {
    let props = this.props.store;
    return (
      <div className="calendar" onMouseLeave={this.lastFocus.bind(this)}>
        <div className="calendar__scale">
          <div className="calendar__all">All day</div>
          <ul className="calendar__points">
            <li>00:00</li>
            <li>03:00</li>
            <li>06:00</li>
            <li>09:00</li>
            <li>12:00</li>
            <li>15:00</li>
            <li>18:00</li>
            <li>21:00</li>
          </ul>
        </div>
        <ul className="calendar__main">
          {
            Object.keys(props).map(p => {
              return (
                <div key={p} data-day={p} className="day">
                  <div className="day__name">
                    {p}
                  </div>
                  <a onClick={this.setAllDay.bind(this)} className="day__btn"></a>
                  <div className="day__graph">
                    {
                      this.buildHours(props[p]).map( (i, y) => {
                        return (
                          <span 
                            key={y} 
                            data-chosen={i} 
                            data-count={y}
                            onMouseDown={this.setFirst.bind(this)}
                            onMouseMove={this.state.isActive 
                              ? this.dropToFinal.bind(this)
                              : null
                            }
                            onMouseUp={this.setFinal.bind(this)}
                          ></span>
                        )
                      })
                    }
                  </div>
              </div>
              )
            })
          }
        </ul>
        <div className="calendar__buttons">
          
          <button className="calendar__clear" href="" 
            onClick={this.clearAll.bind(this)}>
            Clear
          </button>
          <button className="calendar__save" href="" 
            onClick={this.saveAll.bind(this)}>
            Save changes
          </button>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    store: state
  }),
  dispatch => ({
    setActive: (status) => {
      dispatch({type: 'isActive', payload: status})
    },
    setData: (data) => {
      dispatch({type: 'data', payload: data})
    }
  })
)(Calendar);

// export default Calendar;
