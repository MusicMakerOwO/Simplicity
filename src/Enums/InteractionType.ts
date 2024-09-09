enum InteractionType {
	PING = 1,
	SLASH_COMMAND = 2,
	MESSAGE_COMPONENT = 3, // Button or Select Menu, differentiated in code
	COMMAND_AUTOCOMPLETE = 4,
	MODAL_SUBMIT = 5
}
export default InteractionType;