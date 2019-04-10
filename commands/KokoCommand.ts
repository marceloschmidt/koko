import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { KokoApp } from '../KokoApp';
import { processCancelCommand } from './Cancel';
import { processHelpCommand } from './Help';
import { processOneOnOneCommand } from './OneOnOne';
import { processPraiseCommand } from './Praise';
import { processQuestionCommand } from './Question';

export class KokoCommand implements ISlashCommand {
    public command = 'koko';
    public i18nParamsExample = 'Koko_Params';
    public i18nDescription = 'Koko_Description';
    public providesPreview = false;

    private CommandEnum = {
        Cancel: 'cancel',
        Help: 'help',
        Praise: 'praise',
        Question: 'question',
        OneOnOne: 'one-on-one',
        OneOnOneNumeral: '1:1',
    };

    constructor(private readonly app: KokoApp) { }
    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persistence: IPersistence): Promise<void> {
        const [command, ...params] = context.getArguments();
        if (!command) {
            return await processHelpCommand(this.app, context, read, modify);
        }

        switch (command) {
            case this.CommandEnum.Praise:
                await processPraiseCommand(this.app, context, read, modify, persistence, params);
                break;
            case this.CommandEnum.Question:
                await processQuestionCommand(this.app, context, read, modify, persistence);
                break;
            case this.CommandEnum.OneOnOne:
            case this.CommandEnum.OneOnOneNumeral:
                await processOneOnOneCommand(this.app, context, read, modify, persistence);
                break;
            case this.CommandEnum.Cancel:
                await processCancelCommand(this.app, context, read, modify, persistence);
                break;
            default:
                await processHelpCommand(this.app, context, read, modify);
        }
    }
}
