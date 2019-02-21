class Description extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <form>
                <label>
                    <input
                        name="checkingAccount"
                        type="checkbox"
                        checked={this.state.checkingAccount}
                        onChange={this.handleInputChange} />
                        Checking Account &nbsp;
                </label>
                <label>
                    <input
                        name="savingsAccount"
                        type="checkbox"
                        checked={this.state.savingsAccount}
                        onChange={this.handleInputChange} />
                        Savings Account &nbsp;
                </label>
                <label>
                    <input
                        name="CDs"
                        type="checkbox"
                        checked={this.state.CDs}
                        onChange={this.handleInputChange} />
                        CDs/Money Market Accounts &nbsp;
                </label>
                <br />
                <label>
                    <input
                        name="studentBanking"
                        type="checkbox"
                        checked={this.state.studentBanking}
                        onChange={this.handleInputChange} />
                        Student Banking &nbsp;
                </label>
                <label>
                    <input
                        name="autoLoans"
                        type="checkbox"
                        checked={this.state.autoLoans}
                        onChange={this.handleInputChange} />
                        Auto Loans &nbsp;
                </label>
                <label>
                    <input
                        name="homeEquity"
                        type="checkbox"
                        checked={this.state.homeEquity}
                        onChange={this.handleInputChange} />
                        Home Equity &nbsp;
                </label>
                <br />
                <label>
                    <input
                        name="mortgage"
                        type="checkbox"
                        checked={this.state.mortgage}
                        onChange={this.handleInputChange} />
                        Mortgage &nbsp;
                </label>
                <label>
                    <input
                        name="studentLoans"
                        type="checkbox"
                        checked={this.state.studentLoans}
                        onChange={this.handleInputChange} />
                        Student Loans &nbsp;
                </label>
                <label>
                    <input
                        name="sfr"
                        type="checkbox"
                        checked={this.state.sfr}
                        onChange={this.handleInputChange} />
                        Saving for Retirement &nbsp;
                </label>
                <br />
                <label>
                    <input
                        name="investmentAccount"
                        type="checkbox"
                        checked={this.state.investmentAccount}
                        onChange={this.handleInputChange} />
                        Investment Account &nbsp;
                </label>
                <label>
                    <input
                        name="creditCard"
                        type="checkbox"
                        checked={this.state.creditCard}
                        onChange={this.handleInputChange} />
                        Credit Card &nbsp;
                </label>
                <label>
                    <input
                        name="other"
                        type="checkbox"
                        checked={this.state.other}
                        onChange={this.handleInputChange} />
                        Other &nbsp;
                </label>
            </form>
        );
    }
}

ReactDOM.render(
    <Description/>,
    document.getElementById('checkbox')
);