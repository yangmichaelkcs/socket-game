import { FaRegUser, FaUser, FaThumbsUp, FaThumbsDown, FaTimes, FaCheck } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";

{/* <div className="Legend">
<p className="LegendText">&ensp;&ensp;&ensp;</p>
<p className="LegendText">&ensp;&ensp;&ensp;</p>
<p className="LegendText">&ensp;&ensp;&ensp;</p>
</div> */}

class Legend extends React.Component<any, any> {
  public render() {
    return (
      <div className="Legend LegendText container">
        <div className="row">
          <div className="col"><FaRegUser/>Unselected Player</div>
          <div className="col"><FaUser className="PlayerPicked"/>Selected Player</div>
          <div className="w-100"/>
          <div className="col"><FaThumbsUp className="Thumbsup"/>Approved Team</div>
          <div className="col"><FaThumbsDown className="Thumbsdown"/>Rejected Team</div>
          <div className="w-100"/>
          <div className="col"><FaCheck className="Success"/>Succeed Mission</div>
          <div className="col"><FaTimes className="Fail"/>Fail Mission</div>
      </div>
    </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(Legend);