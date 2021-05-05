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
        window.api.send(command, ...props);
    }

    initializeApi() {
        window.api.receive(this.props.ioName, (err, wroteState) => {
            if (err) {
                this.handleApiError(err);
            } else {
                this.setState({
                    apiState: wroteState,
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
