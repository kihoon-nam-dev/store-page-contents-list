import React, {useState, useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputGroup, Button } from 'react-bootstrap';
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from 'react-icons/md';
import cn from 'classnames';
import './App.scss';
import { SET_CONTENTSLIST, SET_FILTER, RESET_FILTER, CANCEL_SET_FILTER } from './index.js';

import axios from 'axios';

function App() {
  var state = useSelector((state) => state);
  let [contentsList, chgContentsList] = useState([]);
  let [loading, chgLoading ] = useState(true);
  let initPricingOptions = [
    {
      name : "PAID",
      value : 0,
      isChecked : false
    },
    {
      name : "FREE",
      value : 1,
      isChecked : false
    },
    {
      name : "VIEW_ONLY",
      value : 2,
      isChecked : false
    }
  ];
  let [pricingOptions, chgPricingOptions] = useState(initPricingOptions);
  let dispatch = useDispatch();
  
  const searchResultTable = useCallback(
    state => {
      const { contentsListReducer, searchFilterReducer } = state;
      console.log("contentsListReducer : ", contentsListReducer);
      console.log("searchFilterReducer : ", searchFilterReducer);
      const hasFilter = Object.values(searchFilterReducer).reduce((result, value) => result || Boolean(value), false);
      const { ids, entities } = contentsListReducer;
      const items = ids
        .map(id => entities[id])
        .filter(
          entity =>
            !hasFilter ||
            Object.entries(searchFilterReducer).reduce(
              (result, [key, value]) => result && (!value || `${entity[key]}` === `${value}`),
              true,
            ),
        );
      
      console.log("items : ", items);
      chgContentsList(items);
    }
  ) 

  useEffect(() => {
    axios.get('https://closet-sample.azurewebsites.net/api/data')
    .then((res) => {
      
      //chgContentsList([res.data]);
      //console.log("1.contentsList:",contentsList);
      // var arr = localStorage.getItem('contentsList');
      // if(arr == null) {
      //     arr = []
      // } else {
      //     arr = JSON.parse(arr);
      // }

      // arr.push(contentsList);

      // localStorage.setItem('contentsList', JSON.stringify(arr));

      //dispatch({ type: SET_CONTENTSLIST, payload: [res.data] })
      chgContentsList([...res.data])
      chgLoading(false);
      console.log("1.beforeSearchResultTable : ", state);
      //searchResultTable(state);
      console.log("1.afterSearchResultTable : ", state);
    })
    .catch(() => {
      chgLoading(false);
      console.log("Failed.");
    })  
  },[]);

  // useEffect(() => {
  //   console.log("2.beforeSearchResultTable : ", state);
  //   searchResultTable(state);
  //   console.log("2.afterSearchResultTable : ", state);
  //   console.log("contentsList : ", contentsList);
  // },[pricingOptions]);
  
  return (
    <div className="App">
      {/* Nav area */}
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">Connect</span>
      </nav>

      {/* Contents Filter area */}
   
      <div className="container">
        1.Contents Filter
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">Pricing Option</InputGroup.Text>
          {       
            pricingOptions.map((pricingOption,i) => {
              return <div 
                key={i}
                //className={cn('checkbox', { checked })} 
                className={cn('checkbox')} 
                onClick={() => { 
                  var copy = [...pricingOptions];
                  copy[i].isChecked = !copy[i].isChecked;
                  copy[i].isChecked ? 
                    dispatch({ type: SET_FILTER, payload : { filterName: "pricingOption", value: copy[i].value }})
                    : dispatch({ type: CANCEL_SET_FILTER, payload : { filterName: copy[i].name, value: copy[i].isChecked }});

                  chgPricingOptions(copy);
                  //searchResultTable(state);
                }}>
                {pricingOption.isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                <div className="text">{pricingOption.name}</div>
              </div>
            })
          }
          <Button variant="outline-secondary" id="button-addon2" onClick={() => { 
            chgPricingOptions(initPricingOptions);
            dispatch({ type: RESET_FILTER })
          }}>
            RESET
          </Button>
        </InputGroup>
        
      </div>
      
      {/* Contents list area */}
      <div className="container">
        2.Contents List
        <div className="row">
          {       
            loading === true ? 
              <div><h4>Loading...</h4></div> 
              :
              contentsList.map((content, i) => {
                return <ContentsList content={content} i={i} key={i}/>
              })
          }
        </div>
      </div>
    </div>
  );
}
  

function ContentsList(props) {
  return (
      <div className="col-md-4">
        <img src={props.content.imagePath} width="100%" height="70%"/>
        <h4>{ props.content.creator }</h4>
        <p> { props.content.title } | { props.content.price } </p>
      </div>
  );
}

export default App;