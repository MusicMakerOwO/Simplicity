export default class Embed {
	public title: 		string | undefined = undefined;
	public type: 		'rich';
	public description: string | undefined = undefined;
	public url: 		string | undefined = undefined;
	public timestamp: 	string | undefined = undefined;
	public color: 		number | undefined = Math.floor( Math.random() * 0xFFFFFF );
	public footer: 		{ text: string; icon_url?: string; proxy_icon_url?: string } | undefined = undefined;
	public image: 		{ url: string; proxy_url?: string; height?: number; width?: number } | undefined = undefined;
	public thumbnail: 	{ url: string; proxy_url?: string; height?: number; width?: number } | undefined = undefined;
	public video: 		{ url: string; height?: number; width?: number } | undefined = undefined;
	public provider: 	{ name: string; url?: string } | undefined = undefined;
	public author: 		{ name: string; url?: string; icon_url?: string; proxy_icon_url?: string } | undefined = undefined;
	public fields: 		Array<{ name: string; value: string; inline?: boolean }> | undefined = undefined;

	static isValid(embed: any = null) {
		if (!embed) return false;
		if (typeof embed !== 'object') return false;
		if (embed.title && typeof embed.title !== 'string') return false;
		if (embed.type && typeof embed.type !== 'string') return false;
		if (embed.description && typeof embed.description !== 'string') return false;
		if (embed.url && typeof embed.url !== 'string') return false;
		if (embed.timestamp && typeof embed.timestamp !== 'string') return false;
		if (embed.color && typeof embed.color !== 'number') return false;
		if (embed.footer && typeof embed.footer !== 'object') return false;
		if (embed.image && typeof embed.image !== 'object') return false;
		if (embed.thumbnail && typeof embed.thumbnail !== 'object') return false;
		if (embed.video && typeof embed.video !== 'object') return false;
		if (embed.provider && typeof embed.provider !== 'object') return false;
		if (embed.author && typeof embed.author !== 'object') return false;
		if (embed.fields && !Array.isArray(embed.fields)) return false;
		return true;
	}

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

	setTimestamp(date: Date | string | number = Date.now()) {
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