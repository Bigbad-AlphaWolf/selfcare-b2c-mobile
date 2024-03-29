/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck');
var channel = require('cordova/channel');
var utils = require('cordova/utils');
var exec = require('cordova/exec');
var cordova = require('cordova'); 

var PLUGIN_NAME = 'EyesOn'
/**
 * @constructor
 */

var eyeson = {
	
	initAgent: function(cb) {
		exec(cb, null, PLUGIN_NAME, 'initAgent', []);
	},
	
	startAgent: function(cb) {
		exec(cb, null, PLUGIN_NAME, 'startAgent', []);
	},
	
	updateConfiguration: function(cb) {
		exec(cb, null, PLUGIN_NAME, 'updateConfiguration', []);
	},
		
	getDqaId: function(cb) {
		exec(cb, null, PLUGIN_NAME, 'getDqaId', []);
	},
	
	getDqaStatus: function(cb) {
		exec(cb, null, PLUGIN_NAME, 'getDqaStatus', []);
	},
	
	getDataCollectStatus: function(cb) {
		exec(cb, null, PLUGIN_NAME, 'getDataCollectStatus', []);
	},
	
	onPermissionChanged: function(cb) {
		exec(cb, null, PLUGIN_NAME, 'onPermissionChanged', []);
	},
	
        
}

module.exports = eyeson;