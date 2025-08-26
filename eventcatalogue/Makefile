first-time-setup:
	npx --yes @eventcatalog/create-eventcatalog@latest --organization-name "NHS Notify" nhsnotify

build:
	cd nhsnotify && npm run build

dev:
	cd nhsnotify && npm run dev

preview:
	cd nhsnotify/dist && npx --yes http-server -p 3001