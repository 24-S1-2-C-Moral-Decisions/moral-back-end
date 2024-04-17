
export class QuestionDto {
    constructor(question: QuestionDto) {
        this.id = question.id;
        this.title = question.title;
        this.text = question.text;
    }
    id: string;
    title: string;
    text: string;
}