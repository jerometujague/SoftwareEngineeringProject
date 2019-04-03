import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './css/base.css';
import './css/manager.css';
import loadingImage from './images/loading.gif';
import AppointmentsView from './managerView/appointmentsView';
import ManagersView from './managerView/managersView';
import ManagerSchedulingView from './managerView/managerSchedulingView';
import BranchSchedulingView from './managerView/branchSchedulingView';
import BranchHoursView from './managerView/branchHoursView';

class ManagerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedId: 0,
        }
    }

    setStateValue(name, value) {
        this.setState({
            [name]: value,
        });
    }

    changeMenu(i) {
        this.setState({
            selectedId: i,
        })
    }

    render() {
        const sideBarItems = ["Appointments", "Managers", "Manager Scheduling", "Branch Scheduling", "Branch Hours"];
        return (
            <div>
                <div id="sideBar">
                    {
                        sideBarItems.map((item, i) => {
                            return (
                                <div key={i} className={this.state.selectedId == i ? "sideBarItem itemSelected" : "sideBarItem"} onClick={this.changeMenu.bind(this, i)}>
                                    {item}
                                    {
                                        this.state.selectedId == i &&
                                        <div className="selectedArrow"></div>
                                    }
                                </div>
                            );
                        })
                    }
                </div>

                <CSSTransition // Show the appointments view
                    in={this.state.selectedId == 0}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <AppointmentsView
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the managers view
                    in={this.state.selectedId == 1}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <ManagersView
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the manager scheduling view
                    in={this.state.selectedId == 2}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <ManagerSchedulingView
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the branch scheduling view
                    in={this.state.selectedId == 3}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <BranchSchedulingView
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the branch hours view
                    in={this.state.selectedId == 4}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <BranchHoursView
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Loading image for when we are retrieving data
                    in={this.state.loading}
                    timeout={{
                        enter: 300,
                        exit: 0,
                    }}
                    classNames="loading"
                    unmountOnExit>
                    <div id="loadingDiv">
                        <img id="loadingImage" src={loadingImage} />
                    </div>
                </CSSTransition>
            </div>
        )
    }
}

ReactDOM.render(
    <ManagerView />,
    document.getElementById('root')
);