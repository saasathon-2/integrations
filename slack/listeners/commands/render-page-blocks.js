const previewUrl = (url) => {
	const artefactId = new URL(url).pathname.split("/").at(-1);
	const preview = new URL(`/api/shared/artefacts/${artefactId}/preview`, url);
	preview.searchParams.set("v", Date.now());
	return preview.toString();
};

const renderPageBlocks = (url, label) => [
	{
		type: "image",
		image_url: previewUrl(url),
		alt_text: label,
	},
	{
		type: "actions",
		elements: [
			{
				type: "button",
				text: {
					type: "plain_text",
					text: "Open in browser",
				},
				url,
				action_id: "open_page",
			},
		],
	},
];

export { renderPageBlocks };
