import { createRulesetFunction } from '@stoplight/spectral-core';
import markdown from 'remark-parse';
import unified from 'unified';
import { Parent, Literal, NodeData, Node } from 'unist';

interface Header<
  ChildNode extends Node<object> = Literal<string>,
  TData extends object = NodeData<ChildNode>,
> extends Node<TData> {
  children: ChildNode[];
  depth: number;
}

interface HeaderInfo {
  title: string;
  depth: number;
}

const processor = unified().use(markdown);

const extractHeaderInfo = (
  node: Header,
  _index: number | undefined = undefined,
  _array: Header[] | undefined = undefined,
): HeaderInfo => ({
  title: node.children[0].value,
  depth: node.depth,
});

const isEqual = (a: object, b: object) =>
  JSON.stringify(a) === JSON.stringify(b);

const diagnostics = (
  tree: HeaderInfo[],
  structure: HeaderInfo[],
  template: string,
) => {
  const missing = tree.filter(
    (info) =>
      !structure.some(
        (header) => header.title === info.title && header.depth === info.depth,
      ),
  );

  return [
    {
      message: `
Description does not follow the template:
\`\`\`md
${template}
\`\`\`

Missing sections:

${missing.map((header) => {
  return `- ${header.title}\n`;
})}`,
    },
  ];
};

export default createRulesetFunction<string, { template: string }>(
  {
    input: null,
    options: {
      type: 'object',
      additionalProperties: false,
      properties: {
        template: true,
      },
      required: ['template'],
    },
  },
  function markdownTemplate(input, options) {
    const tree = processor.parse(input) as Parent;
    const structure = processor.parse(options.template) as Parent;

    const inputHeaders = tree.children
      .filter((node) => node.type === 'heading')
      .map((node) => extractHeaderInfo(node as Header));

    const structureHeaders = structure.children
      .filter((node) => node.type === 'heading')
      .map((node) => extractHeaderInfo(node as Header));

    return isEqual(inputHeaders, structureHeaders)
      ? []
      : diagnostics(structureHeaders, inputHeaders, options.template);
  },
);
