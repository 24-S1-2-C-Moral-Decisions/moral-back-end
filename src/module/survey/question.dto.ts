
export class QuestionDto {
    constructor(question: QuestionDto) {
        this.id = question.id;
        this.title = question.title;
        this.text = question.text;
        this.count=question.count;
        this.studyId=question.studyId;
    }
    id: string;
    title: string;
    text: string;
    count: number;
    studyId: string;
}