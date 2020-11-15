import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import buttons from './buttons.js';

var myBtns = buttons.data;

class Calculator extends React.Component{
  constructor(props){
    super(props);
    this.state = ({
      mem: '',
      current: '0',
      cutoff: '',
      calc: [0,''],
      lastClick: ''
    });
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClick = this.onClick.bind(this);
    this.doMath = this.doMath.bind(this);
    this.handleNum = this.handleNum.bind(this);
    this.handleDec = this.handleDec.bind(this);
    this.handleOp = this.handleOp.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
  }
  
componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
  }
componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPress);
  }
 onKeyPress(event){
  let numChk = myBtns.findIndex(x=> x.value === parseInt(event.key)); //numChk - if the key pressed was 0-9, it returns the number in number format (also the index of the appropriate object in myBtns)
  let opChk = myBtns.findIndex(x=> x.value === event.key); //if key pressed was an operator or decimal, returns the index of the appropriate object in myBtns
  let exChk;
  if(event.key === 'Delete'){
    exChk = 16;  //index of 'clear' in myBtns
  } else if(event.key === 'Enter'){
    exChk = 14; //index of '=' in myBtns
  } 

   let mem = (this.state.mem.length !== 0);
  if(numChk>=0){
    this.handleNum(myBtns[numChk].value,mem);
  } else if(opChk===15){ //checks if opChk is a decimal
    this.handleDec();
  } else if(opChk >=0){
    this.handleOp(myBtns[opChk].value,mem);
  } else if (exChk>=0){
    this.handleExecute(myBtns[exChk].value,mem);
  } else{
    return;
  }

 }
/*the onClick method handles any button click*/
 onClick(event){
let val = event.target.value;
let type = event.target.dataset.type;
let mem = (this.state.mem.length !== 0);

/*this switch statement checks the 'type' property of the object corresponding to the button 
that was clicked, and calls the appropriate method to handle updating the state */
switch(type){
  case "num":
     this.handleNum(val,mem);
     break;
  case "operator":
     this.handleOp(val,mem);
     break;     
  case "decimal":
     this.handleDec();
     break;
  case "executor":
     this.handleExecute(val,mem);
     break;
  default:
     break;

}
}
/*simple method for completing the actual math. Pass it two numbers and the operator, and it will return the calculated result */
doMath(num1,num2,opper) {
        switch(opper){
          case '+':
            return num1+num2;
          case '-':
            return num1-num2;
          case '/':
            return num1/num2;
          case '*':
            return num1*num2;
          default:
            return 1;

        }
}
/*the handleNum method handles whenever a number is clicked*/
handleNum(val){
let x = this.state.cutoff;
if(this.state.cutoff.length > 14){
  x = x.substring(1,);
} else{
  x = this.state.cutoff;
}
if(this.state.current !== '0'){
this.setState({
  current: this.state.current + String(val),
  cutoff: x + String(val),
  lastClick: "num"
});
} else{
  this.setState({
    current: String(val),
    cutoff: String(val),
    lastClick: "num"
  });
}

}

/*the handleDec method handles whenever the decimal is clicked*/
handleDec(){
if(this.state.current.indexOf(".")>=0){
  return;
} else if(this.state.current === '0'){
  this.setState({
    current: '0.',
    cutoff: '0.'
  });
} else {
  this.setState({
    current: this.state.current + '.',
    cutoff: this.state.cutoff + '.',
    lastClick: "decimal"
  });
}
}

/*the handleOp method handles whenever an operator is clicked */
handleOp(val,mem){
if(mem && (this.state.lastClick === 'operator')){  /*Check if there is something in memory AND the last click was an operator */
    if(val==='-' && (this.state.current !== '-')){ /*check if the current click is minus AND the current display is not "-" */
      this.setState({    /*we have the situation where there was an operator clicked previously, and now we are hitting the minus sign, so the person wants a negative number, set display to "-" */
        current: '-',
        cutoff: '-'
      });
    }else if(val === '-' && (this.state.current ==='-')){ /*if we clicked the minus sign multiple times, you will have a negative num and the operator will be negative, no change for duplicate hit of the button */
      return;
    } else {     /*this else statement captures: if there is something in memory, last click was an operator, and it was not the '-' button */
      if(this.state.current === '-'){     /*check if we switched to another operator from selecting minus on the prior click*/

        this.setState({            /*if someone clicks, for example '5 * - +', it will get rid of the negative sign that was added when the user clicked '-' on the prior button click*/
          calc: [this.state.calc[0],val],
          lastClick: 'operator',
          current: '',
          cutoff: ''
        });
      }
    }
} else if(mem && (this.state.lastClick !== 'operator')) {
  let result = this.doMath(this.state.calc[0],Number.parseFloat(this.state.current),this.state.calc[1]);
  this.setState({
    mem: String(result),
    current: '',
    calc: [result,val],
    lastClick: 'operator'
  })
} else{
  this.setState({
    mem: this.state.current,
    current: '',
    cutoff: '',
    calc: [Number.parseFloat(this.state.current),val],
    lastClick: 'operator'
  });
}


}
/*the handleExecute method will handle execution of 'clear' or 'equals' calculator function*/
handleExecute(val,mem){
if(val==="clear"){ /*check if the target of the click was "clear"*/
  this.setState({  /*if it was 'clear', set back to original state*/
    mem: '',
    current: '0',
    cutoff: '',
    calc: [0,''],
    lastClick: ''
  });
} else if (val==="=") { /* if the equals button was pressed*/
    if(mem){
    let result = this.doMath(this.state.calc[0],parseFloat(this.state.current),this.state.calc[1]); /*run the doMath method to calculate */
    let chop;
    if (result.length > 13){  /*check the length of the result to ensure the display doesn't become huge due to long parsed floats [or just huge user-input numbers] */
      chop = result.slice(result.length-14,result.length-1);
    } else{
      chop = result;
    }
    this.setState({
      mem: '',
      current: result,
      cutoff: chop,
      calc: [1,'='],
      lastClick: 'executor'
    });
    }
}

}
 render() {
  return(
  <div id="calcbox">
        <div class="disp mem-disp" id="memory">{this.state.mem}{this.state.calc[1]}</div>

        <div class="disp main-disp" id="display">
          {this.state.current.length > 14
            ? this.state.cutoff
            : this.state.current}
      </div>
      
<div class="btnBox">
          <div class="numeric">
            <div class="rows">
          <button class="button button-num" id={myBtns[0].id} data-type={myBtns[0].type} value={myBtns[0].value} onClick= {this.onClick}>0</button>
          <button class="button" id={myBtns[15].id} data-type={myBtns[15].type} value={myBtns[15].value} onClick={this.onClick}>.</button>
            </div>
            <div class="rows">
          <button class="button button-num" id={myBtns[1].id} data-type={myBtns[1].type} value={myBtns[1].value} onClick= {this.onClick}>1</button>
          <button class="button button-num" id={myBtns[2].id} data-type={myBtns[2].type} value={myBtns[2].value} onClick= {this.onClick}>2</button>
          <button class="button button-num" id={myBtns[3].id} data-type={myBtns[3].type} value={myBtns[3].value} onClick= {this.onClick}>3</button>
            </div>
            <div class="rows">
          <button class="button button-num" id={myBtns[4].id} data-type={myBtns[4].type} value={myBtns[4].value} onClick= {this.onClick}>4</button>
          <button class="button button-num" id={myBtns[5].id} data-type={myBtns[5].type} value={myBtns[5].value} onClick= {this.onClick}>5</button>
          <button class="button button-num" id={myBtns[6].id} data-type={myBtns[6].type} value={myBtns[6].value} onClick= {this.onClick}>6</button>
            </div>
            <div class="rows">
          <button class="button button-num" id={myBtns[7].id} data-type={myBtns[7].type} value={myBtns[7].value} onClick= {this.onClick}>7</button>
          <button class="button button-num" id={myBtns[8].id} data-type={myBtns[8].type} value={myBtns[8].value} onClick= {this.onClick}>8</button>
          <button class="button button-num" id={myBtns[9].id} data-type={myBtns[9].type} value={myBtns[9].value} onClick= {this.onClick}>9</button>
            </div>
            <div class="rows">
          <button class="button button-num" id={myBtns[16].id} data-type={myBtns[16].type} value={myBtns[16].value} onClick= {this.onClick}>c</button>
          <button class="button button-num" id={myBtns[13].id} data-type={myBtns[13].type} value={myBtns[13].value} onClick= {this.onClick}>/</button>
          <button class="button button-num" id={myBtns[12].id} data-type={myBtns[12].type} value={myBtns[12].value} onClick= {this.onClick}>x</button>
            </div>
           </div>
        <div class="operators">
          <button class="button" id={myBtns[11].id} data-type={myBtns[11].type} value={myBtns[11].value} onClick= {this.onClick}>-</button>
          <button class="button" id={myBtns[10].id} data-type={myBtns[10].type} value={myBtns[10].value} onClick= {this.onClick}>+</button>
          <button class="button" id={myBtns[14].id} data-type={myBtns[14].type} value={myBtns[14].value} onClick= {this.onClick}>=</button>
          
          </div> 
      </div>
      
  </div>
    
    
    
    
  )};
}

ReactDOM.render(<Calculator />, document.getElementById('root'));

