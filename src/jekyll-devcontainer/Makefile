build:
	make -C ../../ Makefile version
	npm install -g @devcontainers/cli
	ver=$$(head -n 1 ../../.version 2> /dev/null || echo unknown); \
	verb=$$(echo $$ver | sed 's/\+.*//'); \
	echo "version: $$verb"; \
	BUILDKIT_PROGRESS=plain devcontainer build --workspace-folder ./src --image-name "ghcr.io/nhsdigital/nhs-notify-client-config:$$verb"

publish:
	ver=$$(head -n 1 ../../.version 2> /dev/null || echo unknown); \
	verb=$$(echo $$ver | sed 's/\+.*//'); \
	echo "version: $$verb"; \
	docker image tag ghcr.io/nhsdigital/nhs-notify-client-config:$$verb ghcr.io/nhsdigital/nhs-notify-client-config:latest; \
	docker push "ghcr.io/nhsdigital/nhs-notify-client-config:$$verb"; \
	docker push "ghcr.io/nhsdigital/nhs-notify-client-config:latest"

debug:
	devcontainer up --workspace-folder ./src
	devcontainer exec --workspace-folder ./src ls -la ./.devcontainer
	devcontainer exec --workspace-folder ./src cat ./.devcontainer/packages.txt
	devcontainer exec --workspace-folder ./src ./.devcontainer/check.sh
