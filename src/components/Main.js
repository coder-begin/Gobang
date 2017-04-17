require('normalize.css/normalize.css');
require('styles/App.css');
import React from 'react';
var Stage = React.createClass({
  piecrArr: [],
  isInitStage: false,
  drawStage: function () {
    var checkerboard = this.refs.checkerboard;
    if (checkerboard.getContext) {
      var context = checkerboard.getContext("2d");
      context.clearRect(0, 0, 500, 500);
      context.beginPath();
      context.strokeStyle = "#C2F207";
      context.rect(10, 10, 480, 480);
      for (let i = 1; i < 12; i++) {
        context.moveTo(10 + i * 40, 10);
        context.lineTo(10 + i * 40, 490);
        context.moveTo(10, i * 40 + 10);
        context.lineTo(490, i * 40 + 10);
      }
      context.stroke();

    }
  },
  initStage: function () {
    for (var i = 0, j = 11; i < j; i++) {
      //初始化数组0表示空的，1表示白棋，2表示黑棋
      this.piecrArr[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.drawStage();
  },
  dealPieces: function (x, y, pieceFlag) {
    var top_bottom = 1;
    var left_right = 1;
    var leftTop_rightBottom = 1;
    var rightTop_leftBottom = 1;
    this.piecrArr[x - 1][y - 1] = pieceFlag;
    //判断上下是否为5子
    for (var i = 1; i < 5; i++) {
      //上下---------
      if (x - 1 > -1 && x - 1 < 11 && y - 1 - i > -1 && y - 1 - i < 11) {
        if (this.piecrArr[x - 1][y - 1 - i] == pieceFlag) {
          top_bottom++;
        }
      }
      if (x - 1 > -1 && x - 1 < 11 && y - 1 + i > -1 && y - 1 + i < 11) {
        if (this.piecrArr[x - 1][y - 1 + i] == pieceFlag) {
          top_bottom++;
        }
      }

      //左右---------
      if (x - 1 - i > -1 && x - 1 - i < 11 && y - 1 > -1 && y - 1 < 11) {
        if (this.piecrArr[x - 1 - i][y - 1] == pieceFlag) {
          left_right++;
        }
      }
      if (x - 1 + i > -1 && x - 1 + i < 11 && y - 1 > -1 && y - 1 < 11) {
        if (this.piecrArr[x - 1 + i][y - 1] == pieceFlag) {
          left_right++;
        }
      }


      //左上-右下---------
      if (x - 1 + i > -1 && x - 1 + i < 11 && y - 1 + i > -1 && y - 1 + i < 11) {
        if (this.piecrArr[x - 1 + i][y - 1 + i] == pieceFlag) {
          leftTop_rightBottom++;
        }
      }
      if (x - 1 - i > -1 && x - 1 - i < 11 && y - 1 - i > -1 && y - 1 - i < 11) {
        if (this.piecrArr[x - 1 - i][y - 1 - i] == pieceFlag) {
          leftTop_rightBottom++;

        }
      }

      //左下-右上-------
      if (x - 1 - i > -1 && x - 1 - i < 11 && y - 1 + i > -1 && y - 1 + i < 11) {
        if (this.piecrArr[x - 1 - i][y - 1 + i] == pieceFlag) {
          rightTop_leftBottom++;
        }
      }
      if (x - 1 + i > -1 && x - 1 + i < 11 && y - 1 - i > -1 && y - 1 - i < 11) {
        if (this.piecrArr[x - 1 + i][y - 1 - i] == pieceFlag) {
          rightTop_leftBottom++;
        }
      }

    }
    if (top_bottom >= 5 || left_right >= 5 || leftTop_rightBottom >= 5 || rightTop_leftBottom >= 5) {
      this.props.changeScore(pieceFlag);
      this.props.isBegin(false);
      this.props.changeClickDisabled(false);
      this.showWinner(pieceFlag);
    }


  },
  showWinner:function(winnerFlag){
    var checkerboard = this.refs.checkerboard;
    if (checkerboard.getContext) {
      var context=checkerboard.getContext("2d");
      context.font="normal normal 900 30px 楷体";
      if(winnerFlag==1){
        context.fillStyle="#ffffff";
        context.fillText("白棋赢",200,50);
      }else{
        context.fillStyle="#000000";
        context.fillText("黑棋赢",200,50);
      }
    }
  },
  drawPiece: function (x, y, pieceColorFlag) {
    var checkerboard = this.refs.checkerboard;
    if (checkerboard.getContext) {
      var context = checkerboard.getContext("2d");
      //pieceColorFlag==true为白棋
      if (pieceColorFlag) {
        context.beginPath();
        context.fillStyle = "#ffffff";
        context.arc(10 + 40 * x, 10 + 40 * y, 16, 0, 2 * Math.PI);
        context.fill();

      } else {
        context.beginPath();
        context.fillStyle = "#000000";
        context.moveTo(10 + 40 * x, 10 + 40 * y);
        context.arc(10 + 40 * x, 10 + 40 * y, 16, 0, 2 * Math.PI);
        context.fill();
      }
    } else {
      console.log("不支持getContext")
    }


  },
  clickHandle: function (e) {
    var checkerboard = this.refs.checkerboard, colorFlag = this.props.colorFlag;
    var pieceX = Math.round((e.clientX - checkerboard.getBoundingClientRect().left - 10) / 40);
    var pieceY = Math.round((e.clientY - checkerboard.getBoundingClientRect().top - 10) / 40);
    if (this.props.beginEndFlag) {
      if (colorFlag) {
        if (pieceX && pieceY) {
          this.props.setTimer(!colorFlag);
          this.dealPieces(pieceX, pieceY, 1);
          this.drawPiece(pieceX, pieceY, true);

        }
      } else {
        if (pieceX && pieceY) {
          this.props.setTimer(!colorFlag);
          this.dealPieces(pieceX, pieceY, 2);
          this.drawPiece(pieceX, pieceY, false);
        }
      }
    }
  },
  componentDidMount: function () {
    this.initStage();
  },
  render: function () {
    return (
      <div className="stage">
        <canvas width="500" height="500" ref="checkerboard" onClick={this.clickHandle}>
        </canvas>
      </div>
    );
  }
});
var Count = React.createClass({
  colorFlag: true,
  showEndTime: function () {
    var beginEndFlag = !this.props.beginEndFlag;
    this.props.isBegin(beginEndFlag);
    this.props.changeClickDisabled(true);
    this.props.changeInitStageFlag(!this.props.isInitStage);
  },
  render: function () {
    return (
      <div className="count">
        <div className="score">
          <p>白棋得分:<span >{this.props.whiteScore}</span></p>
          <p>黑棋得分:<span >{this.props.blackScore}</span></p>
          <button disabled={this.props.isDisabled} onClick={this.showEndTime}>开局</button>
        </div>
        <div ref="deadline" className="endTime">
          <span>{this.props.endTime}</span>
        </div>
      </div>
    );
  }

});
var AppComponent = React.createClass({
  timer:null,
  getInitialState: function () {
    return {
      endTime:5,
      beginEndFlag: false,
      pieceColorFlag: true,
      whiteScore: 0, blackScore: 0,
      isDisabled: false,
      isInitStage: true
    }
  },
  changeScore: function (Flag) {
    if (Flag == 1) {
      this.setState({whiteScore: ++this.state.whiteScore});
    } else {
      this.setState({blackScore: ++this.state.blackScore});
    }

  },
  changeInitStageFlag: function (initFlag) {
    if (this.state.isInitStage != initFlag) {
      this.setState({isInitStage: initFlag});
      this.refs.stage.initStage();
    }
  },
  changeClickDisabled: function (isdisabled) {
    this.setState({isDisabled: isdisabled});
  },
  isBegin: function (isbengin) {
    this.setState({beginEndFlag: isbengin},this.setTimer);

  },
  setTimer:function(flag){
    var _this=this;
    if(this.state.beginEndFlag){
      if(this.state.pieceColorFlag!=flag){
        this.setState({pieceColorFlag: flag});
        clearInterval(this.timer);
        this.setState({endTime:5});
        this.timer=setInterval(function(){
          if (_this.state.endTime > 0) {
            _this.setState({endTime: --_this.state.endTime});
          }else{
            if(flag==1){
              _this.changeScore(2);
              clearInterval(_this.timer);
              _this.isBegin(!_this.state.beginEndFlag);
              _this.changeClickDisabled(!_this.state.isDisabled);
              alert("白棋输!");
            }else{
              _this.changeScore(1);
              clearInterval(_this.timer);
              _this.isBegin(!_this.state.beginEndFlag);
              _this.changeClickDisabled(!_this.state.isDisabled);
              alert("黑棋输!");
            }
          }
        },1000);
      }
    }else{
      clearInterval(this.timer);
    }

  },
  render() {
    return (
      <div className="index">
        <Stage ref="stage" beginEndFlag={this.state.beginEndFlag}
               isBegin={this.isBegin}
               setTimer={this.setTimer}
               changeClickDisabled={this.changeClickDisabled}
               changeScore={this.changeScore}
               colorFlag={this.state.pieceColorFlag}/>
        <Count ref="count" beginEndFlag={this.state.beginEndFlag}
               isBegin={this.isBegin}
               changeScore={this.changeScore}
               endTime={this.state.endTime}
               isDisabled={this.state.isDisabled}
               changeInitStageFlag={this.changeInitStageFlag}
               isInitStage={this.state.isInitStage}
               changeClickDisabled={this.changeClickDisabled}
               colorFlag={this.state.pieceColorFlag}
               whiteScore={this.state.whiteScore}
               blackScore={this.state.blackScore}/>
      </div>
    );
  }
});
export default AppComponent;
