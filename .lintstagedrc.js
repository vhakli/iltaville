module.exports = {
	"**/*.ts": (filenames) => {
		const packages = filenames.reduce((acc, filename) => {
			const match = filename.match(/packages\/([^/]+)/);
			if (match && !acc.includes(match[0])) {
				acc.push(match[0]);
			}
			return acc;
		}, []);
		const tsc = packages.map((pkg) => `tsc -p ./${pkg}/tsconfig.json`);
		return [...tsc, `eslint --fix ${filenames.join(" ")}`];
	},
	"*.{js,jsx,ts,tsx,css,md,json,yaml}": ["prettier --write"],
};
