import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputGroup, FormControl } from 'react-bootstrap';
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from 'react-icons/md';
import cn from 'classnames';
import './App.scss';

import axios from 'axios';

function App() {
  let [loading, chgLoading ] = useState(true);
  //let [pricingOption, chgPricingOption] = useState(["PAID","FREE","VIEW_ONLY"]);
  let initPricingOptions = [
    {
      name : "PAID",
      isChecked : false
    },
    {
      name : "FREE",
      isChecked : false
    },
    {
      name : "VIEW_ONLY",
      isChecked : false
    }
  ];
  let [pricingOptions, chgPricingOptions] = useState(initPricingOptions);
  
  let state = useSelector((state) => state.reducer);
  let dispatch = useDispatch();
  var [searchResultItem, chgSearchResultItem] = useState([]);

  useEffect(() => {
    axios.get('https://closet-sample.azurewebsites.net/api/data')
    .then((res) => {
        //chgContents([...res.data]);
        //console.log("contents:", contents);
        //dispatch({ type: 'SET_CONTENTSLIST', payload: contents})
        dispatch({ type: 'SET_CONTENTSLIST', payload: [...res.data]})
        chgLoading(false);
        //items = SearchResult();
        //console.log("items : ", items)
    })
    .catch(() => {
        chgLoading(false);
        console.log("Failed.");
    })  
  },[]);

  useEffect(() =>{
    console.log("test!");
  
    console.log("state : ",state);
  
    const { contentsList, searchFilter } = state;
    var args = searchFilter || []; 
    //const hasFilter = Object.values(searchFilter).reduce((result, value) => result || Boolean(value), false);
    const hasFilter = Object.values(args).reduce((result, value) => result || Boolean(value), false);
    const { ids, entities } = contentsList;
    const items = ids
      .map(id => entities[id])
      .filter(
        entity =>
          !hasFilter ||
          Object.entries(searchFilter).reduce(
            (result, [key, value]) => result && (!value || `${entity[key]}` === `${value}`),
            true,
          ),
      );
    chgSearchResultItem(items);

  },[pricingOptions])
  
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
                  chgPricingOptions(copy);
                  pricingOption.isChecked ? 
                    dispatch({ type: 'SET_FILTER', payload : { filterName: "pricingOption", value: pricingOption.name }})
                    : dispatch({ type: 'CANCEL_SET_FILTER', payload : { filterName: "pricingOption", value: pricingOption.name }});
                  
                }}>
                {pricingOption.isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                <div className="text">{pricingOption.name}</div>
              </div>
            })
          }
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
              console.log("test2") 
              //contents.map((content, i) => {
             
             
              // state.contentsList.map((content, i) => {
              //   return <ContentsList content={content} i={i} key={i}/>
              // })

              // items.map((content, i) => {
              //   return <ContentsList content={content} i={i} key={i}/>
              // })
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