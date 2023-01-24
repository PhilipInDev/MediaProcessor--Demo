class PerformanceMeasurement {
	static getStartTime () {
		return process.hrtime();
	}

	static getElapsedTimeMs (startTime: [number, number]) {
		return (startTime[0] + (startTime[1] / 1e6)).toFixed(3);
	}
}

export { PerformanceMeasurement };
