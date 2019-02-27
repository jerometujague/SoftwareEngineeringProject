"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Description =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Description, _React$Component);

  function Description(props) {
    var _this;

    _classCallCheck(this, Description);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Description).call(this, props));
    _this.state = {
      checked: false
    };
    _this.handleInputChange = _this.handleInputChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Description, [{
    key: "handleInputChange",
    value: function handleInputChange(event) {
      var target = event.target;
      var value = target.type === 'checkbox' ? target.checked : target.value;
      var name = target.name;
      this.setState(_defineProperty({}, name, value));
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("form", null, React.createElement("label", null, React.createElement("input", {
        name: "checkingAccount",
        type: "checkbox",
        checked: this.state.checkingAccount,
        onChange: this.handleInputChange
      }), "Checking Account \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "savingsAccount",
        type: "checkbox",
        checked: this.state.savingsAccount,
        onChange: this.handleInputChange
      }), "Savings Account \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "CDs",
        type: "checkbox",
        checked: this.state.CDs,
        onChange: this.handleInputChange
      }), "CDs/Money Market Accounts \xA0"), React.createElement("br", null), React.createElement("label", null, React.createElement("input", {
        name: "studentBanking",
        type: "checkbox",
        checked: this.state.studentBanking,
        onChange: this.handleInputChange
      }), "Student Banking \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "autoLoans",
        type: "checkbox",
        checked: this.state.autoLoans,
        onChange: this.handleInputChange
      }), "Auto Loans \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "homeEquity",
        type: "checkbox",
        checked: this.state.homeEquity,
        onChange: this.handleInputChange
      }), "Home Equity \xA0"), React.createElement("br", null), React.createElement("label", null, React.createElement("input", {
        name: "mortgage",
        type: "checkbox",
        checked: this.state.mortgage,
        onChange: this.handleInputChange
      }), "Mortgage \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "studentLoans",
        type: "checkbox",
        checked: this.state.studentLoans,
        onChange: this.handleInputChange
      }), "Student Loans \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "sfr",
        type: "checkbox",
        checked: this.state.sfr,
        onChange: this.handleInputChange
      }), "Saving for Retirement \xA0"), React.createElement("br", null), React.createElement("label", null, React.createElement("input", {
        name: "investmentAccount",
        type: "checkbox",
        checked: this.state.investmentAccount,
        onChange: this.handleInputChange
      }), "Investment Account \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "creditCard",
        type: "checkbox",
        checked: this.state.creditCard,
        onChange: this.handleInputChange
      }), "Credit Card \xA0"), React.createElement("label", null, React.createElement("input", {
        name: "other",
        type: "checkbox",
        checked: this.state.other,
        onChange: this.handleInputChange
      }), "Other \xA0"));
    }
  }]);

  return Description;
}(React.Component);

ReactDOM.render(React.createElement(Description, null), document.getElementById('checkbox'));