module.exports = {
	"**/*.ts?(x)": (filenames) => {
		const packages = filenames.reduce((acc, filename) => {
			const match = filename.match(/packages\/([^/]+)/);
			if (match && !acc.includes(match[0])) {
				acc.push(match[0]);
			}
			return acc;
		}, []);
		return packages.map((pkg) => `tsc -p ./${pkg}/tsconfig.json`);
	},
};
