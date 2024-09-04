// {
//     v: 9,
//     user_settings: {},
//     user: {
//       verified: true,
//       username: 'Crate Bot',
//       mfa_enabled: true,
//       id: '1100580118579122258',
//       global_name: null,
//       flags: 0,
//       email: null,
//       discriminator: '5195',
//       clan: null,
//       bot: true,
//       avatar: 'b9c835d03146cd8ff8361cd18a0cdedb'
//     },
//     session_type: 'normal',
//     session_id: 'd72154f706671ed07129eee3d21391d9',
//     resume_gateway_url: 'wss://gateway-us-east1-c.discord.gg',
//     relationships: [],
//     private_channels: [],
//     presences: [],
//     guilds: [ [Object], [Object] ],
//     guild_join_requests: [],
//     geo_ordered_rtc_regions: [ 'us-south', 'atlanta', 'us-central', 'us-east', 'us-west' ],
//     auth: {},
//     application: { id: '1100580118579122258', flags: 27828224 },
//     _trace: [
//       '["gateway-prd-us-east1-c-13x9",{"micros":71503,"calls":["id_created",{"micros":920,"calls":[]},"session_lookup_time",{"micros":260,"calls":[]},"session_lookup_finished",{"micros":16,"calls":[]},"discord-sessions-prd-1-290",{"micros":68823,"calls":["start_session",{"micros":57712,"calls":["discord-api-rpc-7f6cf669d-k9mdl",{"micros":53399,"calls":["get_user",{"micros":12626},"get_guilds",{"micros":4915},"send_scheduled_deletion_message",{"micros":7},"guild_join_requests",{"micros":1},"authorized_ip_coro",{"micros":7}]}]},"starting_guild_connect",{"micros":62,"calls":[]},"presence_started",{"micros":2971,"calls":[]},"guilds_started",{"micros":164,"calls":[]},"guilds_connect",{"micros":1,"calls":[]},"presence_connect",{"micros":7879,"calls":[]},"connect_finished",{"micros":7888,"calls":[]},"build_ready",{"micros":20,"calls":[]},"clean_ready",{"micros":1,"calls":[]},"optimize_ready",{"micros":0,"calls":[]},"split_ready",{"micros":1,"calls":[]}]}]}]'
//     ]
//   }


export declare type ReadyEvent = {
	v: number;
	user_settings: {};
	user: {
		verified: boolean;
		username: string;
		mfa_enabled: boolean;
		id: string;
		global_name: string | null;
		flags: number;
		email: string | null;
		discriminator: string;
		clan: string | null;
		bot: boolean;
		avatar: string;
	};
	session_type: string;
	session_id: string;
	resume_gateway_url: string;
	relationships: [];
	private_channels: [];
	presences: [];
	guilds: Array<Object>;
	guild_join_requests: [];
	geo_ordered_rtc_regions: string[];
	auth: {};
	application: {
		id: string;
		flags: number;
	};
	_trace: string[];
}