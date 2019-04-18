import 'babel-polyfill';
import 'details-element-polyfill';
import $ from 'jquery';
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
import BranchesView from './managerView/branchesView';
import ServicesView from './managerView/servicesView';

class ManagerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            calendar: [],
            customers: [],
            branches: [],
            managers: [],
            branchUnavailables: [],
            managerUnavailables: [],
            branchHours: [],
            appointments: [],
            loading: false,
            selectedId: 0,
        }

        this.dataNeeded = ['services', 'calendar', 'customers', 'branches', 'managers', 'branchUnavailables', 'managerUnavailables', 'branchHours', 'appointments'];
    }

    componentDidMount() {
        this.loadAllData();
    }

    async loadAllData() {
        for (let data of this.dataNeeded) {
            await this.loadData(data, true);
        }

        this.setState({
            loading: false,
        })
    }

    async loadData(data, sequence) {
        this.setState({
            loading: true,
        })

        const url = "/api/" + data;

        await $.getJSON(url, dataList => {
            const newData = [];
            dataList.forEach(dataItem => {
                newData.push(dataItem);
            });

            this.setState({
                [data]: newData,
            });
        });

        if (!sequence) {
            this.setState({
                loading: false,
            })
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
        const sideBarItems = ["Appointments", "Managers", "Branches", "Services", "Manager Scheduling", "Branch Scheduling", "Branch Hours"];
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
                    in={this.state.selectedId == 0 && this.state.appointments.length > 0}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <AppointmentsView
                        appointments={this.state.appointments}
                        calendar={this.state.calendar}
                        services={this.state.services}
                        managers={this.state.managers}
                        branches={this.state.branches}
                        customers={this.state.customers}
                        loadData={this.loadData.bind(this)}
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the managers view
                    in={this.state.selectedId == 1}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <ManagersView
                        branches={this.state.branches}
                        managers={this.state.managers}
                        loadData={this.loadData.bind(this)}
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the branches view
                    in={this.state.selectedId == 2}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <BranchesView
                        branches={this.state.branches}
                        loadData={this.loadData.bind(this)}
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the services view
                    in={this.state.selectedId == 3}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <ServicesView
                        services={this.state.services}
                        loadData={this.loadData.bind(this)}
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the manager scheduling view
                    in={this.state.selectedId == 4}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <ManagerSchedulingView
                        managerUnavailables={this.state.managerUnavailables}
                        managers={this.state.managers}
                        calendar={this.state.calendar}
                        loadData={this.loadData.bind(this)}
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the branch scheduling view
                    in={this.state.selectedId == 5}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <BranchSchedulingView
                        branchUnavailables={this.state.branchUnavailables}
                        branches={this.state.branches}
                        calendar={this.state.calendar}
                        loadData={this.loadData.bind(this)}
                        setStateValue={this.setStateValue.bind(this)} />
                </CSSTransition>

                <CSSTransition // Show the branch hours view
                    in={this.state.selectedId == 6}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <BranchHoursView
                        branchHours={this.state.branchHours}
                        branches={this.state.branches}
                        loadData={this.loadData.bind(this)}
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