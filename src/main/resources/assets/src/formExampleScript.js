class LoginForm extends React.Component {
    constructor(props){
        super(props);
    }

    handleSubmit(){
        alert("You have submitted the form");
    }

    render(){
        return (
            <div id="formDiv">
                <form action="#" method="GET" onSubmit={this.handleSubmit.bind(this)}>
                    <label>
                        Name
                        <input type="text"/>
                    </label>
                    
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <LoginForm />;
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);