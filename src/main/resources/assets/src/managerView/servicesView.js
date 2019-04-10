import $ from 'jquery';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { EditDialog, EditorData, EditItem } from './editDialog';

export default class ServicesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            showEditDialog: false,
            editorData: undefined,
        }

        this.loadServices();
    }

    async loadServices() {
        const url = "/api/services";

        await $.getJSON(url, dataList => {
            const newData = [];
            dataList.forEach(dataItem => {
                newData.push(dataItem);
            });

            this.setState({
                services: newData,
            });
        });
    }

    editService(index, id, service) {
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(id, [new EditItem('Service', service)], [], index * 35 + 87),
        })
    }

    addService() {
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(-1, [new EditItem('Service', '')], [], this.props.services.length * 35 + 93),
        })
    }

    async deleteService(id) {
        this.props.setStateValue('loading', true);

        await $.ajax({
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/services/delete/' + id + '/'
        });

        await this.props.loadData('services');
        this.props.setStateValue('loading', false);
    }

    async saveEdits(id, newValues) {
        this.props.setStateValue('loading', true);

        if (id == -1) {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/services/add',
                data: JSON.stringify({
                    service: newValues[0]
                })
            });
        } else {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/services/update',
                data: JSON.stringify({
                    id: id,
                    service: newValues[0]
                })
            });
        }

        await this.props.loadData('services');
        this.props.setStateValue('loading', false);

        this.setState({
            showEditDialog: false,
        })
    }

    closeEditor() {
        this.setState({
            showEditDialog: false,
        })
    }

    render() {
        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Services</h2>
                <table>
                    <thead>
                        <tr>
                            <td className="headerData">Service</td>
                            <td colSpan="2"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.services.map((service, index) => {

                                return (
                                    <tr key={service.id}>
                                        <td className="tableData">{service.service}</td>
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editService.bind(this, index, service.id, service.service)} />
                                        </td>
                                        <td className="tableData">
                                            <input type="submit" value="Delete" onClick={this.deleteService.bind(this, service.id)} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <input type="submit" value="Add new service" className="newItemButton" onClick={this.addService.bind(this)} />
                <CSSTransition // Show the edit dialog
                    in={this.state.showEditDialog}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <EditDialog
                        editorData={this.state.editorData}
                        saveHandler={this.saveEdits.bind(this)}
                        closeHandler={this.closeEditor.bind(this)} />
                </CSSTransition>
            </div>
        );
    }
}