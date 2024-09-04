/*
title?	string	title of embed
type?	string	type of embed (always "rich" for webhook embeds)
description?	string	description of embed
url?	string	url of embed
timestamp?	ISO8601 timestamp	timestamp of embed content
color?	integer	color code of the embed
footer?	embed footer object	footer information
image?	embed image object	image information
thumbnail?	embed thumbnail object	thumbnail information
video?	embed video object	video information
provider?	embed provider object	provider information
author?	embed author object	author information
fields?	array of embed field objects	fields information, max of 25
*/

export default class Embed {
	public title?: string;
	public type: string;
	public description?: string;
	public url?: string;
	public timestamp?: string;
	public color?: number;
	public footer?: { text: string; icon_url?: string; proxy_icon_url?: string };
	public image?: { url: string; proxy_url?: string; height?: number; width?: number };
	public thumbnail?: { url: string; proxy_url?: string; height?: number; width?: number };
	public video?: { url: string; height?: number; width?: number };
	public provider?: { name: string; url?: string };
	public author?: { name: string; url?: string; icon_url?: string; proxy_icon_url?: string };
	public fields?: Array<{ name: string; value: string; inline?: boolean }>;

	constructor() {
		this.type = 'rich';
	}

	setTitle(title: string) {
		if (title.length > 256) throw new Error('Embed title cannot exceed 256 characters');
		this.title = String(title);
		return this;
	}

	setDescription(description: string) {
		if (description.length > 2048) throw new Error('Embed description cannot exceed 2048 characters');
		this.description = description;
		return this;
	}

	setURL(url: string) {
		if (url.length > 2000) throw new Error('Embed URL cannot exceed 2000 characters');
		this.url = url;
		return this;
	}

	setTimestamp(date: Date | string | number) {
		this.timestamp = new Date(date).toISOString();
		return this;
	}

	setColor(color: number | string | [number, number, number]) {
		if (typeof color === 'string') {
			if (color.startsWith('#')) color = parseInt(color.slice(1), 16);
			else color = parseInt(color);
		} else if (Array.isArray(color)) {
			color = (color[0] << 16) + (color[1] << 8) + color[2];
		}
		this.color = Number(color);
		return this;
	}

	setFooter(text: string, icon_url?: string, proxy_icon_url?: string) {
		if (text.length > 2048) throw new Error('Embed footer text cannot exceed 2048 characters');
		this.footer = { text: text, icon_url, proxy_icon_url };
		return this;
	}

	setImage(url: string, proxy_url?: string, height?: number, width?: number) {
		this.image = { url, proxy_url, height, width };
		return this;
	}

	setThumbnail(url: string, proxy_url?: string, height?: number, width?: number) {
		this.thumbnail = { url, proxy_url, height, width };
		return this;
	}

	setVideo(url: string, height?: number, width?: number) {
		this.video = { url, height, width };
		return this;
	}

	setProvider(name: string, url?: string) {
		this.provider = { name, url };
		return this;
	}

	setAuthor(name: string, url?: string, icon_url?: string, proxy_icon_url?: string) {
		if (name.length > 256) throw new Error('Embed author name cannot exceed 256 characters');
		this.author = { name, url, icon_url, proxy_icon_url };
		return this;
	}

	addField(name: string, value: string, inline = false) {
		if (this.fields?.length === 25) throw new Error('Embed fields cannot exceed 25');
		if (name.length > 256) throw new Error('Embed field name cannot exceed 256 characters');
		if (value.length > 1024) throw new Error('Embed field value cannot exceed 1024 characters');
		if (!this.fields) this.fields = [];
		this.fields.push({ name, value, inline });
		return this;
	}

	toJSON() {
		return {
			title: this.title,
			type: this.type,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: this.image,
			thumbnail: this.thumbnail,
			video: this.video,
			provider: this.provider,
			author: this.author,
			fields: this.fields
		};
	}
}
module.exports = exports.default;