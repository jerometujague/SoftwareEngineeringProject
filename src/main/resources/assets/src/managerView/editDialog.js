import React from 'react'

export default class EditDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="editDialog">
                {
                    this.props.editItems.map((item, index) => {
                        return <input key={index} type="text" defaultValue={item} />
                    })
                }
                <input type="submit" value="Save" onClick={this.props.saveHandler} />
            </div>
        );
    }
}