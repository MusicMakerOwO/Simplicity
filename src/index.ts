require('./PluginManager'); // runs automatically


exports.Client = require('./Client');
exports.WSClient = require('./WSClient');
exports.VCClient = require('./VCClient');
exports.UDPClient = require('./UDP');
exports.Websocket = require('./Websocket');
exports.EventListener = require('./EventListener');
exports.EventDispatcher = require('./EventDispatcher');


// export * as Client from './Client';
// export * as WSClient from './WSClient';
// export * as VCClient from './VCClient';
// export * as UDPClient from './UDP';
// export * as Websocket from './Websocket';
// export * as EventListener from './EventListener';
// export * as EventDispatcher from './EventDispatcher';

// module.exports = {
// 	Client: require('./Client'),
// 	WSClient: require('./WSClient'),
// 	VCClient: require('./VCClient'),

// 	UDPClient: require('./UDP'),
// 	Websocket: require('./Websocket'),

// 	EventListener: require('./EventListener'),
// 	EventDispatcher: require('./EventDispatcher'),
// };