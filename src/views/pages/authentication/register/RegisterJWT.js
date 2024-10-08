import React from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import { connect } from "react-redux";
import axios from "axios";
import { signupWithJWT } from "../../../../redux/actions/auth/registerActions";
import { history } from "../../../../history";
import swal from "sweetalert";
class RegisterJWT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seller_name: "",
      seller_email: "",
      password: "",
      confirm_password: "",
      selectedFile: null,
      status: "",
    };
  }

  handleRegister = (e) => {
    e.preventDefault();
    this.props.signupWithFirebase(
      this.state.seller_name,
      this.state.seller_email,
      this.state.password
    );
  };
  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  changeHandler1 = (e) => {
    this.setState({ status: e.target.value });
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();

    axios
      .post("/35.154.86.59/api/admin/seller_signup", this.state)
      .then((response) => {
        console.log(response);
        alert("Seller Added Successful");
        swal("Successful!", "You clicked the button!", "success");
        this.props.history.push("/pages/login");
      })
      .catch((error) => {
        //  swal("Error!", "You clicked the button!", "error");
        console.log(error);
      });
  };

  render() {
    return (
      <Form action="/" onSubmit={this.handleRegister}>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Name"
            name="seller_name"
            required
            value={this.state.seller_name}
            onChange={(e) => this.setState({ seller_name: e.target.value })}
          />
          <Label>Name</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="email"
            placeholder="Email"
            required
            name="seller_email"
            value={this.state.seller_email}
            onChange={(e) => this.setState({ seller_email: e.target.value })}
          />
          <Label>Email</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Password"
            required
            name="password"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />
          <Label>Password</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Confirm Password"
            required
            value={this.state.confirm_password}
            onChange={(e) =>
              this.setState({ confirm_password: e.target.value })
            }
          />
          <Label>Confirm Password</Label>
        </FormGroup>
        <FormGroup>
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label=" I accept the terms & conditions."
            defaultChecked={true}
          />
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/pages/login");
            }}
          >
            Login
          </Button.Ripple>
          <Button.Ripple color="primary" type="submit">
            Register
          </Button.Ripple>
        </div>
      </Form>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    values: state.auth.register,
  };
};
export default connect(mapStateToProps, { signupWithJWT })(RegisterJWT);
