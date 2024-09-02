export enum WSEvents {
	OPEN = 'open',
	CLOSE = 'close',
	ERROR = 'error',
	MESSAGE = 'message',
}

export enum ClientEvents {
	READY = 'ready',
	MESSAGE_CREATE = 'messageCreate',
	MESSAGE_UPDATE = 'messageUpdate',
	MESSAGE_DELETE = 'messageDelete',
	INTERACTION_CREATE = 'interactionCreate',
	COMMAND_USED = 'commandUsed',
	BUTTON_CLICK = 'buttonClick',
	SELECT_MENU = 'selectMenu',
	MODAL_SUBMIT = 'modalSubmit'
}