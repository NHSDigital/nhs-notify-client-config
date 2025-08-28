import * as fs from 'node:fs';
import { generateMermaidDiagram } from 'zod-mermaid';
import packageJson from '../../package.json';
import { $Campaign, $ChannelSupplier, $Client, $FeatureFlag, $SupplierQuota } from '../domain';
import { $Queue } from '../domain/queue';
import { $Envelope, $Insert, $Specification, $SpecificationGroup } from '../domain/specification';
import { $SpecificationSupplier } from '../domain/specificationSupplier';
import { $Layout } from '../domain/layout';
import { $ClientMutatedEvent } from '../schemas/client-mutated-event';
import { $ConfigChangedEvent } from '../schemas/config-changed-event';
import { $ConfigRemovedEvent } from '../schemas/config-removed-event';

const version = packageJson.version;

// Generate mermaid diagrams for the client-mutated, config-changed and config-removed events
for (const [key, schema] of Object.entries({
  'client-mutated': $ClientMutatedEvent,
  'config-changed': $ConfigChangedEvent,
  'config-removed': $ConfigRemovedEvent
})) {
  const file = `mermaid/${key}-${version}.md`;
  const mermaid = generateMermaidDiagram(schema, { diagramType: 'er' });
  fs.writeFileSync(file, `# ${key}-${version} event schema

\`\`\`mermaid
${mermaid}
\`\`\`
`);
  console.info(`Wrote mermaid diagram for ${key} to ${file}`);
}

// Generate mermaid diagrams for the config domain model entities
{
  const file = `mermaid/client-domain-model-${version}.md`;
  const mermaid = generateMermaidDiagram([
    $FeatureFlag,
    $Client,
    $Campaign,
    $ChannelSupplier,
    $Queue,
    $SupplierQuota,
    $SpecificationSupplier
  ], { diagramType: 'er', includeOptional: true });
  fs.writeFileSync(file, `# Client Config Domain Model Entities

\`\`\`mermaid
${mermaid}
\`\`\`
`);
  console.info(`Wrote mermaid diagram for config domain model to ${file}`);
}

// Generate mermaid diagrams for the specification domain model entities
{
  const file = `mermaid/specification-domain-model-${version}.md`;
  const mermaid = generateMermaidDiagram([
    $Specification, $Envelope, $Layout, $Insert, $SpecificationGroup
  ], { diagramType: 'er' });
  fs.writeFileSync(file, `# Specification Config Domain Model Entities

\`\`\`mermaid
${mermaid}
\`\`\`
`);
  console.info(`Wrote mermaid diagram for specification domain model to ${file}`);
}
