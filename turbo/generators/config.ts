import { PlopTypes } from '@turbo/gen'
import { spawnSync } from 'node:child_process'

function spawn(ctx: any, config: any): any {
	spawnSync(config.command, config.args, {
		cwd: ctx.turbo.paths.cwd + '/packages/' + ctx.name,
	})
}

export default function generator(plop: PlopTypes.NodePlopAPI) {
	plop.setActionType('spawn', spawn)
	plop.setGenerator('package', {
		actions: [
			{
				base: 'package/',
				destination: 'packages/{{ name }}/',
				templateFiles: 'package/*',
				type: 'addMany',
			},
			{
				args: ['install', '-D', 'typescript', 'tsdown', '@types/node'],
				command: 'pnpm',
				type: 'spawn',
			} as any,
		],
		description: 'Generates a new package',
		prompts: [
			{
				message: 'What is the name of the package?',
				name: 'name',
				type: 'input',
			},
		],
	})
}
