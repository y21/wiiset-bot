import Base from "../Base";

export default interface Event {
    type: string;
    run: (base: Base, ...data: any[]) => any;
}