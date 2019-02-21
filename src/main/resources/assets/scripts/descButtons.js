var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Description = function (_React$Component) {
    _inherits(Description, _React$Component);

    function Description(props) {
        _classCallCheck(this, Description);

        var _this = _possibleConstructorReturn(this, (Description.__proto__ || Object.getPrototypeOf(Description)).call(this, props));

        _this.state = {
            checked: false
        };

        _this.handleInputChange = _this.handleInputChange.bind(_this);
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
            return React.createElement(
                "form",
                null,
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "checkingAccount",
                        type: "checkbox",
                        checked: this.state.checkingAccount,
                        onChange: this.handleInputChange }),
                    "Checking Account \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "savingsAccount",
                        type: "checkbox",
                        checked: this.state.savingsAccount,
                        onChange: this.handleInputChange }),
                    "Savings Account \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "CDs",
                        type: "checkbox",
                        checked: this.state.CDs,
                        onChange: this.handleInputChange }),
                    "CDs/Money Market Accounts \xA0"
                ),
                React.createElement("br", null),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "studentBanking",
                        type: "checkbox",
                        checked: this.state.studentBanking,
                        onChange: this.handleInputChange }),
                    "Student Banking \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "autoLoans",
                        type: "checkbox",
                        checked: this.state.autoLoans,
                        onChange: this.handleInputChange }),
                    "Auto Loans \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "homeEquity",
                        type: "checkbox",
                        checked: this.state.homeEquity,
                        onChange: this.handleInputChange }),
                    "Home Equity \xA0"
                ),
                React.createElement("br", null),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "mortgage",
                        type: "checkbox",
                        checked: this.state.mortgage,
                        onChange: this.handleInputChange }),
                    "Mortgage \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "studentLoans",
                        type: "checkbox",
                        checked: this.state.studentLoans,
                        onChange: this.handleInputChange }),
                    "Student Loans \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "sfr",
                        type: "checkbox",
                        checked: this.state.sfr,
                        onChange: this.handleInputChange }),
                    "Saving for Retirement \xA0"
                ),
                React.createElement("br", null),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "investmentAccount",
                        type: "checkbox",
                        checked: this.state.investmentAccount,
                        onChange: this.handleInputChange }),
                    "Investment Account \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "creditCard",
                        type: "checkbox",
                        checked: this.state.creditCard,
                        onChange: this.handleInputChange }),
                    "Credit Card \xA0"
                ),
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        name: "other",
                        type: "checkbox",
                        checked: this.state.other,
                        onChange: this.handleInputChange }),
                    "Other \xA0"
                )
            );
        }
    }]);

    return Description;
}(React.Component);

ReactDOM.render(React.createElement(Description, null), document.getElementById('checkbox'));