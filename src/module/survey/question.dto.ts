

export class QuestionDto {
    constructor(question: QuestionDto) {
        this.id = question.id;
        this.title = question.title;
        this.selftext = question.selftext;
    }
    id: string;
    title: string;
    selftext: string;
}