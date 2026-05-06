#!/usr/bin/env sh
set -eu

if git rev-parse --verify HEAD >/dev/null 2>&1; then
	exec vitest run --changed HEAD --passWithNoTests
fi

exec vitest run --passWithNoTests
