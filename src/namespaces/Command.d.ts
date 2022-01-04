export interface Command {
    name: string;
    description: string;
    options?: CommandOption[];
    version: string;
    main?: string;
	active?: boolean;
}

interface CommandOption {
    name: string;
    description: string;
    choices?: CommandChoice[];
    required?: boolean;
    type: 'STRING' | 'BOOLEAN' | 'USER';
}

interface CommandChoice {
    name: string;
    description: string;
}
