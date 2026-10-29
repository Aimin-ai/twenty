import { type ToolRegistryService } from 'src/engine/core-modules/tool-provider/services/tool-registry.service';
import { createExecuteToolTool } from 'src/engine/core-modules/tool-provider/tools/execute-tool.tool';
import { type ToolContext } from 'src/engine/core-modules/tool-provider/types/tool-context.type';

describe('createExecuteToolTool', () => {
  const context = {} as ToolContext;

  const buildRegistry = () =>
    ({
      resolveAndExecute: jest
        .fn()
        .mockResolvedValue({ success: true, result: {} }),
    }) as unknown as ToolRegistryService;

  it('executes tools the predicate allows', async () => {
    const toolRegistry = buildRegistry();

    const executeTool = createExecuteToolTool(toolRegistry, context, {
      isToolAllowed: (toolName) => toolName === 'find_many_people',
    });

    const result = await executeTool.execute({
      toolName: 'find_many_people',
      arguments: {},
    });

    expect(toolRegistry.resolveAndExecute).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('refuses tools the predicate rejects without touching the registry', async () => {
    const toolRegistry = buildRegistry();

    const executeTool = createExecuteToolTool(toolRegistry, context, {
      isToolAllowed: (toolName) => toolName === 'find_many_people',
    });

    const result = await executeTool.execute({
      toolName: 'create_one_workflow',
      arguments: {},
    });

    expect(toolRegistry.resolveAndExecute).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it('executes any tool when no predicate is provided', async () => {
    const toolRegistry = buildRegistry();

    const executeTool = createExecuteToolTool(toolRegistry, context);

    const result = await executeTool.execute({
      toolName: 'find_many_people',
      arguments: {},
    });

    expect(toolRegistry.resolveAndExecute).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('parses arguments sent as a JSON string into an object', async () => {
    const toolRegistry = buildRegistry();

    const executeTool = createExecuteToolTool(toolRegistry, context);

    await executeTool.execute({
      toolName: 'create_many_people',
      arguments: '{"records":[{"position":"last"}]}',
    } as never);

    expect(toolRegistry.resolveAndExecute).toHaveBeenCalledWith(
      'create_many_people',
      { records: [{ position: 'last' }] },
      context,
      expect.anything(),
    );
  });

  it.each([
    ['a non-JSON string', 'not json'],
    ['a JSON string that is not an object', '[1,2]'],
    ['an array', [{ position: 'last' }]],
    ['a number', 42],
  ])(
    'refuses arguments given as %s without touching the registry',
    async (_label, invalidArguments) => {
      const toolRegistry = buildRegistry();

      const executeTool = createExecuteToolTool(toolRegistry, context);

      const result = await executeTool.execute({
        toolName: 'create_many_people',
        arguments: invalidArguments,
      } as never);

      expect(toolRegistry.resolveAndExecute).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
    },
  );

  it('treats missing arguments as an empty object', async () => {
    const toolRegistry = buildRegistry();

    const executeTool = createExecuteToolTool(toolRegistry, context);

    await executeTool.execute({ toolName: 'find_many_people' } as never);

    expect(toolRegistry.resolveAndExecute).toHaveBeenCalledWith(
      'find_many_people',
      {},
      context,
      expect.anything(),
    );
  });
});
