export default function SnowflakeToDate(snowflake: string): Date {
	return new Date(Number(BigInt(snowflake) >> 22n) + 1420070400000);
}