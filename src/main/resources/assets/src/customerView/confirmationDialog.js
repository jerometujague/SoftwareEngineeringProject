import React from 'react';

export default class ConfirmationDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="confirmationDialog">
                <p>{this.props.infoText}</p>
                <div id="confirmButtonHolder">
                    <input type="submit" value="Yes" id="yesButton" onClick={this.props.onYesClicked} />
                    <input type="submit" value="No" id="noButton" onClick={this.props.onNoClicked} />
                </div>
            </div>
        );
    }
}