import { Craft } from "./craft";

export class Job {
    jobName: string;
    level: number;
    xp: number;
    maxXp: number;
    Craft: Craft[];
    constructor(
        jobName: string,
        level: number,
        xp: number,
        maxXp: number,
        Craft: Craft[]
    ) {
        this.jobName = jobName;
        this.level = level;
        this.xp = xp;
        this.maxXp = maxXp;
        this.Craft = Craft;
    }
}

