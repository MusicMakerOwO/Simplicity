import { OPCodes } from './Enums';

declare type GatewayPayload = {
	op: OPCodes;
	d: any;
	s: number;
	t: string;
}

declare type HelloEvent = {
	op: OPCodes.HELLO;
	d: {
		heartbeat_interval: number;
	},
	s: null;
	t: null;
}