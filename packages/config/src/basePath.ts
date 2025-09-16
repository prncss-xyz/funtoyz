function getBasePath() {
	const repo = process.env.GITHUB_REPOSITORY
	if (!repo) return undefined
	const [, name] = repo.split('/')
	if (!name) return undefined
	return '/' + name
}

export const basePath = getBasePath()
