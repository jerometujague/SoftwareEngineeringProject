"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var host = "";

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.state = {
      branches: []
    };
    return _this;
  }

  _createClass(App, [{
    key: "loadBranches",
    value: function loadBranches() {
      var _this2 = this;

      var url = host + "/api/branches";
      $.getJSON(url, function (branchList) {
        var newBranches = [];
        branchList.forEach(function (branch) {
          newBranches.push(branch);
        });

        _this2.setState({
          branches: newBranches
        });
      });
    }
  }, {
    key: "updateBranch",
    value: function updateBranch() {
      var branchID = 4;
      $.ajax({
        type: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        url: host + '/api/branch/' + branchID,
        data: JSON.stringify({
          open: false,
          hours: "9-5"
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var divs = [];
      this.state.branches.forEach(function (branch) {
        divs.push(React.createElement("p", null, branch.name));
        divs.push(React.createElement("p", null, branch.id));
        divs.push(React.createElement("p", null, branch.streetAddress));
        divs.push(React.createElement("p", null, branch.city));
        divs.push(React.createElement("p", null, branch.state));
        divs.push(React.createElement("p", null, branch.zipCode));
      });
      return React.createElement("div", null, divs);
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));