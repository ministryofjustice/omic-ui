import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import '../index.scss';
import MessageBar from "../../MessageBar/index";
import ValidationErrors from "../../ValidationError";


class KeyworkerSettings extends Component {
  render () {
    const buttonText = this.props.supported ? 'Save settings' : 'Save settings and migrate';
    const statusText = this.props.supported ? 'Enabled' : 'Not yet enabled';
    const sequenceFrequencyString = this.props.sequenceFrequency && this.props.sequenceFrequency.toString();
    const frequencySelect =

      (<select id="frequency-select" name="frequency-select" className="form-control sequenceFrequency"
        value={sequenceFrequencyString}
        onChange={this.props.handleSequenceFrequency}>
        <option id="option_once_a_week" key="1" value="1">Once a week</option>
        <option id="option_once_a_fortnight" key="2" value="2">Once a fortnight</option>
      </select>);

    const { user } = this.props;
    const caseLoadOption = user.caseLoadOptions ? user.caseLoadOptions.find((option) => option.caseLoadId === user.activeCaseLoadId) : undefined;
    const caseLoadDesc = caseLoadOption ? caseLoadOption.description : user.activeCaseLoadId;

    return (
      <div>
        <MessageBar {...this.props}/>
        <div className="pure-g">
          <div className="pure-u-md-12-12 padding-top">
            <Link id={`back_link`} title="Back link" className="link backlink" to={`/`} >
              <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Back</Link>
            <h1 className="heading-large margin-top">Manage key worker settings</h1>
          </div>
          <div className="pure-u-md-12-12 padding-top">
            <div className="pure-u-md-2-12" >
              <div className="bold">Prison</div>
            </div>
            <div className="pure-u-md-7-12" >
              <div>{caseLoadDesc}</div>
            </div>
          </div>
          <div className="pure-u-md-12-12 padding-top">
            <div className="pure-u-md-2-12" >
              <div className="bold">Status</div>
            </div>
            <div className="pure-u-md-7-12" id="status">
              <div>{statusText}</div>
            </div>
            <hr/>
          </div>

          <div className="pure-u-md-12-12 padding-top">
            <fieldset className="inline">
              <div className="pure-u-md-2-12" >
                Allow auto-allocation
              </div>
              <div className="pure-u-md-4-12" >
                <div className="multiple-choice">
                  <input id="allowAutoYes" name="allowAutoYes" type="radio" value="true" checked={this.props.allowAuto} onClick={this.props.handleAllowAutoChange}/>
                  <label htmlFor="allowAutoYes">Yes</label>
                </div>
                <div className="multiple-choice">
                  <input id="allowAutoNo" name="allowAutoNo" type="radio" value="false" checked={!this.props.allowAuto} onClick={this.props.handleAllowAutoChange}/>
                  <label htmlFor="allowAutoNo">No</label>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="pure-u-md-12-12 padding-top">
            <div className="pure-u-md-2-12" >
              Capacity Tier 1
            </div>
            <div className="pure-u-md-7-12" >
              <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'capacity'} />
              <input type="text" className="form-control capacityInput" id="capacity" name="capacity" value={this.props.capacity} onChange={this.props.handleCapacityChange}/>
            </div>
          </div>

          <div className="pure-u-md-12-12 padding-top">
            <div className="pure-u-md-2-12" >
              Capacity Tier 2
            </div>
            <div className="pure-u-md-7-12" >
              <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'extCapacity'} />
              <input type="text" className="form-control capacityInput" id="extCapacity" name="extCapacity" value={this.props.extCapacity} onChange={this.props.handleExtCapacityChange}/>
            </div>
          </div>

          <div className="pure-u-md-12-12 padding-top">
            <div className="pure-u-md-2-12" >
              Session frequency
            </div>
            <div className="pure-u-md-3-12" >
              {frequencySelect}
            </div>
          </div>

          <div className="pure-u-md-8-12 padding-top-large margin-top">
            <div className="pure-u-md-10-12">
              <div className="buttonGroup">
                <button id="save-button" className="button button-save"
                  onClick={() => this.props.handleUpdate(this.props.history)}>{buttonText}
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    );
  }
}

KeyworkerSettings.propTypes = {
  history: PropTypes.object,
  handleUpdate: PropTypes.func.isRequired,
  handleAllowAutoChange: PropTypes.func.isRequired,
  handleCapacityChange: PropTypes.func.isRequired,
  handleExtCapacityChange: PropTypes.func.isRequired,
  handleSequenceFrequency: PropTypes.func.isRequired,
  user: PropTypes.object,
  allowAuto: PropTypes.bool,
  migrated: PropTypes.bool,
  supported: PropTypes.bool,
  sequenceFrequency: PropTypes.number,
  capacity: PropTypes.number,
  extCapacity: PropTypes.number,
  validationErrors: PropTypes.object
};


export default KeyworkerSettings;
