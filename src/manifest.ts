import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = packageJson.version
	// can only contain digits, dots, or dash
	.replace(/[^\d.-]+/g, "")
	// split into version parts
	.split(/[.-]/);

const manifest = defineManifest(async () => ({
	manifest_version: 3,
	name: packageJson.displayName ?? packageJson.name,
	version: `${major}.${minor}.${patch}.${label}`,
	description: packageJson.description,
	background: { service_worker: "src/pages/background/index.ts" },
	action: {
		default_popup: "src/pages/popup/index.html",
		default_icon: "icons/128.png",
	},
	icons: {
		"16": "icons/16.png",
		"32": "icons/32.png",
		"48": "icons/48.png",
		"128": "icons/128.png",
	},
	content_scripts: [
		{
			matches: ["https://*.youtube.com/*"],
			js: ["src/pages/content/index.ts"],
		},
	],
	web_accessible_resources: [
		{
			resources: ["assets/js/*.js", "assets/css/*.css", "assets/img/*"],
			matches: ["https://*.youtube.com/*"],
		},
	],
	permissions: ["tabs", "clipboardWrite", "scripting"],
	host_permissions: ["https://*.youtube.com/*"],
}));

export default manifest;
