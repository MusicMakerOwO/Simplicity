export declare type Embed = {
	title?: string;
	description?: string;
	url?: string;
	timestamp?: string;
	color?: number;
	footer?: {
		text: string;
		icon_url?: string;
	};
	image?: {
		url: string;
	};
	thumbnail?: {
		url: string;
	};
	video?: {
		url: string;
	};
	provider?: {
		name: string;
		url: string;
	};
	author?: {
		name: string;
		url?: string;
		icon_url?: string;
	};
	fields?: {
		name: string;
		value: string;
		inline?: boolean;
	}[];
}

export declare type Button = {
	type: 2;
	style: 1 | 2 | 3 | 4 | 5 | 6;
	label: string;
	custom_id: string;
	disabled?: boolean;
	emoji?: {
		id?: string;
		name: string;
	};
	url?: string;
}

export declare type SelectMenuOption = {
	label: string;
	value: string;
	description?: string;
	emoji?: {
		id?: string;
		name: string;
	};
	default?: boolean;
}

export declare type SelectMenu = {
	type: 3;
	custom_id: string;
	options: Array<SelectMenuOption>;
	placeholder?: string;
	min_values?: number;
	max_values?: number;
	disabled?: boolean;
}

export declare type ModalQuestion = {
	type: 4;
	label: string;
	custom_id: string;
	placeholder: string;
	min_length?: number;
	max_length?: number;
	required?: boolean;
	data?: string;
}

export declare type Modal = {
	type: 5;
	title: string;
	custom_id: string;
	components: Array<ActionRow<ModalQuestion>>;
}

export declare type ActionRow<T = Button | SelectMenu | ModalQuestion> = {
	type: 1;
	components: Array<T>;
}