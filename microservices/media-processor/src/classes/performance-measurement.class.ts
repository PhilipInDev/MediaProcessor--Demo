class PerformanceMeasurement {
	static getStartTime () {
		return process.hrtime();
	}

	static getElapsedTimeMs (startTime: [number, number]) {
		return (startTime[0] * 1000 + (startTime[1] / 1e9)).toFixed(3);
	}
}

export { PerformanceMeasurement };
