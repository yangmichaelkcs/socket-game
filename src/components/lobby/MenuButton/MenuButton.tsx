import * as React from "react";
import { connect } from "react-redux";
import { mainMenu } from "socket";

class MenuButton extends React.Component<any, any> {
    public render() {
      const { onClick } = this.props;
      return <button type="button" className="btn btn-primary" style={{margin:"1rem"}} onClick={onClick}>Main Menu</button>;
    }
}
  
const mapDispatchToProps = dispatch => ({
    onClick: () => {
      mainMenu();
    }
});
  
export default connect(undefined, mapDispatchToProps)(MenuButton);
  