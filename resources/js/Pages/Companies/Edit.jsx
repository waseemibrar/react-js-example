import axios from "axios";
import { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
export const withNavigation = (Component) => {
    return (props) => <Component {...props} navigate={useNavigate()} />;
};
export const withParms = (Component) => {
    return (props) => <Component {...props} params={useParams()} />;
};
class CompaniesEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            email: "",
            address: "",
            website: "",
            errors: {},
            isLoading: false,
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleWebsiteChange = this.handleWebsiteChange.bind(this);
    }
    handleNameChange(event) {
        this.setState({name: event.target.value});
    }
    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handleAddressChange(event) {
        this.setState({address: event.target.value});
    }
    handleWebsiteChange(event) {
        this.setState({website: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.isLoading) return;
        this.setState({
            errors: {},
            isLoading: true,
        });
        axios
            .put("/api/companies/"+ this.state.id, {
                name: this.state.name,
                email: this.state.email,
                address: this.state.address,
                website: this.state.website,
            })
            .then((response) => this.props.navigate("/dashboard"))
            .catch((error) => {
                if(error.response.data.errors) {
                    this.setState({errors: error.response.data.errors})
                } else {
                    let message = [];
                    message.message = [error.response.data.message];
                    this.setState({errors: message})
                }
            })
            .finally(() => this.setState({ isLoading: false }));
    }
    componentDidMount() {
        this.setState({isLoading: true});
        axios.get("/api/companies/"+ this.props.params.id)
            .then((response) => {
                this.setState({id: response.data.data.id});
                this.setState({name: response.data.data.name});
                this.setState({email: response.data.data.email});
                this.setState({address: response.data.data.address});
                this.setState({website: response.data.data.website});
            })
            .finally(() => this.setState({ isLoading: false }));
    }
    errorMessage(field) {
        return (
            <div className="text-sm text-red-600 space-y-1 mt-2">
                {this.state.errors?.[field]?.map((message, index) => {
                    return <div key={index}>{message}</div>;
                })}
            </div>
        );
    }
    render() {
        return (
            <div>
                <div className="text-center">
                    <h3 className="font-semibold text-xl text-gray-800 leading-tight">Edit Company</h3>
                </div>
                {this.errorMessage('message')}
                <form className="space-y-6" onSubmit={this.handleSubmit}>
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Name</label>
                        <input className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" type="text" defaultValue={this.state.name || ''} onChange={this.handleNameChange} placeholder="Name"/>
                        {this.errorMessage('name')}
                    </div>
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Email</label>
                        <input className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" type="email" defaultValue={this.state.email || ''} onChange={this.handleEmailChange} placeholder="name@example.com"/>
                        {this.errorMessage('email')}
                    </div>
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Address</label>
                        <input className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" type="text" defaultValue={this.state.address || ''} onChange={this.handleAddressChange} placeholder="Address"/>
                        {this.errorMessage('address')}
                    </div>
                    <div>
                        <label className="block font-medium text-sm text-gray-700">Website</label>
                        <input className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full" type="url" defaultValue={this.state.website || ''} onChange={this.handleWebsiteChange} placeholder="https://google.com"/>
                        {this.errorMessage('website')}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercasse bg-gray-800 rounded-md border border-transparent ring-gray-300 transition duration-150 ease-in-out hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring disabled:opacity-25"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
export default withParms(withNavigation(CompaniesEdit));