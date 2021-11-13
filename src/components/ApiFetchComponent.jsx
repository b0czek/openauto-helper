import React from "react";

class ApiFetchComponent extends React.Component {
    state = {
        apiState: null,
    };

    handleApiError(err) {
        this.setState({
            apiState: null,
        });
    }

    handleApiRequest(command, ...props) {
        window.api.send(this.props.ioName, command, ...props);
    }

    handleApiInvoke(...data) {
        return window.api.invoke(this.props.ioName, ...data);
    }
    initApiListener(channelSuffix, command) {
        let channel = `${this.props.ioName}:${channelSuffix}`;

        window.api.receive(channel, (err, data) => {
            this.setState({
                [channelSuffix]: err ? null : data,
            });
        });
        window.api.send(channel, command);
    }

    initializeApi() {
        window.api.receive(this.props.ioName, (err, apiState) => {
            if (err) {
                this.handleApiError(err);
            } else {
                this.setState({
                    apiState,
                });
            }
        });

        window.api.send(this.props.ioName, "read");
    }
    // in case you need to call componentDidMount in extending class,
    // just call this.initializeApi() if you want to preserve default behaviour
    componentDidMount() {
        this.initializeApi();
    }
}
export default ApiFetchComponent;
