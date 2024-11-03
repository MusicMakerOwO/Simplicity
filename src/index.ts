require('./PluginManager'); // runs automatically

import Client from './Client';
import WSClient from './WSClient';
import VCClient from './VCClient';
import UDP from './UDP';
import Websocket from './Websocket';
import EventListener from './EventListener';
import EventDispatcher from './EventDispatcher';

export {
	Client,
	WSClient,
	VCClient,
	UDP,
	Websocket,
	EventListener,
	EventDispatcher,
};

// exports.Client = require('./Client');
// exports.WSClient = require('./WSClient');
// exports.VCClient = require('./VCClient');
// exports.UDP = require('./UDP');
// exports.Websocket = require('./Websocket');
// exports.EventListener = require('./EventListener');
// exports.EventDispatcher = require('./EventDispatcher');


// export * as Client from './Client';
// export * as WSClient from './WSClient';
// export * as VCClient from './VCClient';
// export * as UDP from './UDP';
// export * as Websocket from './Websocket';
// export * as EventListener from './EventListener';
// export * as EventDispatcher from './EventDispatcher';

// module.exports = {
// 	Client: require('./Client'),
// 	WSClient: require('./WSClient'),
// 	VCClient: require('./VCClient'),

// 	UDP: require('./UDP'),
// 	Websocket: require('./Websocket'),

// 	EventListener: require('./EventListener'),
// 	EventDispatcher: require('./EventDispatcher'),
// };