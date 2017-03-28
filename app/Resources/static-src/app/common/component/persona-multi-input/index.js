import React, { Component } from 'react';
import MultiInput from '../multi-input';
import List from './list';

function initItem(dataSourceUi,data,index,props) {
  let obj = {
    itemId:Math.random(),
    nickname: data[props.nickname],
    isVisible: data[props.isVisible] == 1 ? true : false,
    avatar: data[props.avatar],
    seq: index,
    id:data[props.id],
    outputValue: {
      [props.id]: data[props.id],
      [props.isVisible]: data[props.isVisible] ,
    }
  }
  dataSourceUi.push(obj);
}

function updateChecked(dataSourceUi,id) {
  dataSourceUi.map((item,index)=>{
    if(item.itemId == id) {
      dataSourceUi[index].isVisible = !dataSourceUi[index].isVisible;
      dataSourceUi[index].outputValue.isVisible = dataSourceUi[index].isVisible ? 1 : 0
    }
  })
}

export default class PersonaMultiInput extends MultiInput {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.state = {
      dataSourceUi: [],
    }
    this.props.dataSource.map((item,index)=>{
      initItem(this.state.dataSourceUi,item,index+1,this.props);
    })
  }

  getChildContext() {
    return {
      removeItem: this.removeItem,
      sortItem: this.sortItem,
      addItem: this.addItem,
      onChecked:this.onChecked,
    }
  }

  onChecked=(event)=> {
    let id = event.currentTarget.value;
    updateChecked(this.state.dataSourceUi,id);
    this.setState({
      dataSourceUi: this.state.dataSourceUi,
    });
  }

  addItem = (value,data) =>{
    if(!data)  {
      return;
    }
    //@TODO重复添加提示
    if(this.props.replaceItem) {
      this.state.dataSourceUi = [];
    }
    initItem(this.state.dataSourceUi,data,this.state.dataSourceUi.length+1,this.props);

    this.setState({
      dataSourceUi: this.state.dataSourceUi,
    });
  }

  getList() {
    return (<List listClassName={this.props.listClassName}  dataSourceUi = {this.state.dataSourceUi}  sortable={this.props.sortable} showCheckbox = {this.props.showCheckbox} showDeleteBtn = {this.props.showDeleteBtn}  inputName = { this.props.inputName } checkBoxName ={this.props.checkBoxName}></List>);
  }
}

PersonaMultiInput.propTypes = {
  ...MultiInput.propTypes,
  id:React.PropTypes.string,
  nickname:React.PropTypes.string,
  avatar: React.PropTypes.string,
  isVisible:React.PropTypes.string,
  replaceItem: React.PropTypes.bool,
  showCheckbox:React.PropTypes.bool,
  showDeleteBtn:React.PropTypes.bool,
};

PersonaMultiInput.defaultProps = {
  ...MultiInput.defaultProps,
  id: 'id',
  nickname:'nickname',
  avatar: 'avatar',
  isVisible:'isVisible',
  replaceItem: false,
  showCheckbox: true,
  showDeleteBtn:true,
};

PersonaMultiInput.childContextTypes = {
  ...MultiInput.childContextTypes,
  onChecked: React.PropTypes.func
};
