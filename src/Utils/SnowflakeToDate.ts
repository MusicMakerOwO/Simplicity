export default function SnowflakeToDate(snowflake: string): Date {
	if (typeof snowflake !== 'string') throw new Error(`Invalid snowflake : Expected a string but got ${typeof snowflake}`);
	return new Date(Number(BigInt(snowflake) >> 22n) + 1420070400000);
}
module.exports = exports.default;