/*
1	Action Row	Container for other components
2	Button	Button object
3	String Select	Select menu for picking from defined text options
4	Text Input	Text input object
5	User Select	Select menu for users
6	Role Select	Select menu for roles
7	Mentionable Select	Select menu for mentionables (users and roles)
8	Channel Select	Select menu for channels
*/

enum ComponentTypes {
	ACTION_ROW = 1,
	BUTTON = 2,
	STRING_SELECT = 3,
	TEXT_INPUT = 4,
	MODAL = 4, // alias apparently???
	USER_SELECT = 5,
	ROLE_SELECT = 6,
	MENTIONABLE_SELECT = 7,
	CHANNEL_SELECT = 8
}

export default ComponentTypes;