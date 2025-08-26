# NHS Notify Config

This repository contains code and schemas for NHS Notify configuration management, event publishing, and onboarding automation.

## Purpose

- **Configuration Model:** Defines and manages client, campaign, quota, supplier, and routing configuration for NHS Notify.
- **Event Schemas:** Publishes configuration changes as events to an event bus for consumption by other system components.
- **Onboarding Automation:** Automates and streamlines the onboarding of new integrators, supporting self-serve and admin-driven workflows.

## Event Schema Catalogue

[Event Catalogue](eventcatalogue/README.md)

## Design

### Configuration Management

A phased approach will be used to improve client configuration management:

1. **Libraries & Validation:** Standardise configuration and naming, reduce manual errors, and improve auditability.
2. **API Layer:** Centralise access to configuration data.
3. **Web UI:** Enable operations/admin teams to manage configuration with validation and audit trails.

Configuration entities include:

- `client`, `campaign`, `client_feature`, `client_quota`, `client_subscription`
- `mesh_mailbox`, `apim_application`, `govuknotify_account`
- `supplier_quota`, `channel_supplier`, `queue`, `suppression_filter`, `additional_mesh_report_subscription`

Configuration changes are validated, auditable, and published to environments via an event bus.

### Event Publishing

Configuration changes are published as events to a central event bus, enabling decoupled updates across bounded contexts (core, print supplier API, template/routing UI, user management, etc.).

Event publishing strategies include:

- CLI tools (tactical)
- Scheduled audit tasks (tactical)
- Admin/Web UI (strategic, single source of truth)

### Onboarding Automation

Quick Start onboarding will enable rapid, self-serve client setup in INT:

- **Phase 1:** CLI/script automation using minimal data (client name, APIM ID, etc.)
- **Phase 2:** Web UI for onboarding, protected by CIS2 auth, triggers config change events
- **Phase 3:** Admin UI for incremental client config management and production promotion
- **Phase 4:** Full self-serve onboarding via Web UI (admin approval for production)

## Usage

### Testing

There are `make` tasks for you to configure to run your tests. Run
`make test` to see how they work. You should be able to use the same
entry points for local development as in your CI pipeline.

## Contributing

Describe or link templates on how to raise an issue, feature request
or make a contribution to the codebase. Reference the other
documentation files, like

- Environment setup for contribution, i.e. `CONTRIBUTING.md`
- Coding standards, branching, linting, practices for development and
  testing
- Release process, versioning, changelog
- Backlog, board, roadmap, ways of working
- High-level requirements, guiding principles, decision records, etc.

## Contacts

Provide a way to contact the owners of this project. It can be a team,
an individual or information on the means of getting in touch via
active communication channels, e.g. opening a GitHub discussion,
raising an issue, etc.

## Licence

Unless stated otherwise, the codebase is released under the MIT
License. This covers both the codebase and any sample code in the
documentation.

Any HTML or Markdown documentation
is [© Crown Copyright](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/)
and available under the terms of
the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
