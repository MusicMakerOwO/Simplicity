export enum UDP_OP_CODES {
	// WS Packets
	INDENTIFY = 0,
	SELECT_PROTOCOL_ACK = 4,
	CLIENTS_CONNECT = 11,
	
	DAVE_PROTOCOL_PREPARE_TRANSITION = 21,
	DAVE_PROTOCOL_EXECUTE_TRANSITION = 22,
	DAVE_PROTOCOL_READY_FOR_TRANSITION = 23,
	DAVE_PROTOCOL_PREPARE_EPOCH = 24,

	// UDP Packets
	DAVE_MLS_EXTERNAL_SENDER_PACKAGE = 25,
	DAVE_MLS_KEY_PACKAGE = 26,
	DAVE_MLS_PROPOSALS = 27,
	DAVE_MLS_COMMIT_WELCOME = 28,
	DAVE_MLS_ANNOUNCE_COMMIT_TRANSACTION = 29,
	DAVE_MLS_WELCOME = 30,
	DAVE_MLS_INVALID_COMMIT_WELCOME = 31,
}