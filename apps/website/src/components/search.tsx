'use client'
import { create } from '@orama/orama'
import { useDocsSearch } from 'fumadocs-core/search/client'
import {
	SearchDialog,
	SearchDialogClose,
	SearchDialogContent,
	SearchDialogHeader,
	SearchDialogIcon,
	SearchDialogInput,
	SearchDialogList,
	SearchDialogOverlay,
	type SharedProps,
} from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'

function initOrama() {
	return create({
		// https://docs.orama.com/docs/orama-js/supported-languages
		language: 'english',
		schema: { _: 'string' },
	})
}

export default function DefaultSearchDialog(props: SharedProps) {
	const { locale } = useI18n() // (optional) for i18n
	const { query, search, setSearch } = useDocsSearch({
		initOrama,
		locale,
		type: 'static',
	})

	return (
		<SearchDialog
			isLoading={query.isLoading}
			onSearchChange={setSearch}
			search={search}
			{...props}
		>
			<SearchDialogOverlay />
			<SearchDialogContent>
				<SearchDialogHeader>
					<SearchDialogIcon />
					<SearchDialogInput />
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList items={query.data !== 'empty' ? query.data : null} />
			</SearchDialogContent>
		</SearchDialog>
	)
}
