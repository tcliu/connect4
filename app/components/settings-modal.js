'use strict';
const React = require('react');
const $ = require('jquery');
const _ = require('lodash');
const BS = require('react-bootstrap');
const colorpicker = require('bootstrap-colorpicker');

const Modal = BS.Modal;
const Button = BS.Button;
const Form = BS.Form;
const FormControl = BS.FormControl;
const FormGroup = BS.FormGroup;
const InputGroup = BS.InputGroup;
const Panel = BS.Panel;
const Col = BS.Col;

module.exports = React.createClass({

	getInitialState: function() {
		return {
			showModal: false,
			settings: _.clone(this.props.settings)
		};
	},

	close: function() {
		this.setState({ showModal: false });
	},

	open: function() {
		this.setState({ showModal: true });
		this.resetSettings();
	},

	changeColour: function(e) {
		var el = e.target;
		if (el) {
			var target = el.getAttribute('data-target');
			$(el).colorpicker().on('changeColor', e => {
				if (el.getAttribute('data-index')) {
					var index = Number(el.getAttribute('data-index'));
					this.state.settings[target][index] = e.color.toHex();
				} else {
					this.state.settings[target] = e.color.toHex();
				}
	            this.forceUpdate();
	        });
	        $(el).colorpicker('show');
		}
	},

	applySettings: function(e) {
		this.props.events.updateSettings(e, this.state.settings);
		this.close();
	},

	resetSettings: function(e) {
		this.setState({settings: _.clone(this.props.settings)});
	},

	updateSettings: function(e) {
		var el = e.target;
		var dataType = el.getAttribute('data-type');
		var v = el.value || '';
		if (dataType == 'array') {
			var index = Number(el.getAttribute('data-index'));
			this.state.settings[el.name][index] = v;
		} else {
			switch (dataType) {
				case 'number': v = _.toNumber(v); break;
				case 'bool': v = _.isBoolean(v); break;
			};
			this.state.settings[el.name] = v;
		}
		this.forceUpdate();
	},

	get: function(key) {
		return this.state.settings[key] || '';
	},

	render: function() {
		return (
			<Modal show={this.state.showModal} onHide={this.close}>
				<Modal.Header closeButton>
					<Modal.Title>Game Settings</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form horizontal>
						<FormGroup control="playerCount">
							<Col sm={3}>Number of players</Col>
							<Col sm={3}>
								<FormControl componentClass="select" name="playerCount" value={this.get('playerCount')} data-type="number" onChange={this.updateSettings}>
								{[1,this.get('maxPlayerCount')].map(n => <option value={n}>{n}</option>)}
								</FormControl>
							</Col>
						</FormGroup>
						<FormGroup control="difficulty">
							<Col sm={3}>Difficulty</Col>
							<Col sm={5}>
								<FormControl componentClass="select" name="difficulty" value={this.get('difficulty')} data-type="number" onChange={this.updateSettings}>
									<option value="1">Easy</option>
									<option value="2">Moderate</option>
									<option value="3">Hard</option>
								</FormControl>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={3}>Board size</Col>
							<Col sm={9}>
								<FormControl type="number" bsStyle="board-size-item" name="rows" value={this.get('rows')} data-type="number" min="1" placeholder="Rows" onChange={this.updateSettings} />
								<div className="form-control-board-size-item">&times;</div>
								<FormControl type="number" bsStyle="board-size-item" name="cols" value={this.get('cols')} data-type="number" min="1" placeholder="Columns" onChange={this.updateSettings} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={3}>Board colour</Col>
							<Col sm={9}>
								<div className="board-colour-picker" style={{background: this.get('boardFill')}} data-target="boardFill" onClick={this.changeColour}></div>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={3}>Sound</Col>
							<Col sm={3}>
								<FormControl componentClass="select" name="sound" value={this.get('sound')} data-type="number" onChange={this.updateSettings}>
									<option value="1">On</option>
									<option value="2">Off</option>
								</FormControl>
							</Col>
							<Col sm={3}></Col>
						</FormGroup>
						{this.get('playerCount') > 1 ?
						<Panel header="Player names">
						{[1,this.get('maxPlayerCount')].map(n => 
							<FormGroup control="playerNames" key={'playerNames' + n}>
								<Col sm={3}>Player {n}</Col>
								<Col sm={9}>
								<InputGroup key={'playerNameInputGroup' + n}>
									<FormControl type="text" name={'playerNames'} placeholder="Enter name" value={this.get('playerNames')[n-1]} data-type="array" data-index={n-1} 
										onChange={this.updateSettings} autoFocus={n == 1} ref={(c) => this['playerNameInput' + n] = c} />
									<InputGroup.Addon bsStyle="player-colour-picker" data-target="playerFills" data-index={n-1} style={{background: this.get('playerFills')[n-1]}} 
										onClick={this.changeColour} ></InputGroup.Addon>
								</InputGroup>
								</Col>
							</FormGroup>
						)}
						</Panel> : ""}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="primary" onClick={this.applySettings}>Apply</Button>
					<Button onClick={this.resetSettings}>Reset</Button>
					<Button onClick={this.close}>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}

});