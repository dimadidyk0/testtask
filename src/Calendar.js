import React, { Component } from 'react';

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      data: JSON.parse(localStorage.getItem('storage')),
      isActive: false
    };
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

      this.state.data[day].push(this.hoursToMinutes(first, last))
      this.setState({
        data: this.state.data
      })
      
      this.lastFocus();
      
      // setTimeout( function() {
      //   if (!parent.querySelector('[data-chosen=false]')) {
      //     parent.parentNode.querySelector('a').classList.add('full-day')
      //   } else {
      //     parent.parentNode.querySelector('a').classList.remove('full-day');
      //   }
      // },200)
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
      this.state.data[day][0] = this.hoursToMinutes(0,23);
      // parent.querySelector('a').classList.add('full-day');
    } else {
      this.state.data[day] = [];
      // parent.querySelector('a').classList.remove('full-day')      
    }
    this.setState({
      data: this.state.data
    })

  }

  

  clearAll(e) {
    e.preventDefault();
    Object.keys(this.state.data).forEach(i => {
      this.state.data[i] = [];
    });
    this.setState({
      data: this.state.data
    })
  }

  filterData(day) {
    let data = this.state.data[day];
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
    Object.keys(this.state.data).forEach(i => {
      this.filterData(i);
    })
    console.log(this.state.data);
    localStorage.setItem('storage', JSON.stringify(this.state.data));    this.setState({
      data: this.state.data
    })
  }

  render() {
    
    let props = this.state.data;
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

export default Calendar;
