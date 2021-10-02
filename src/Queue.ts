import Song from "./Song";


export default class Queue<T> {

    list: Array<T> = []

    get isEmpty(): boolean {
        return  this.list.length == 0;
    }

    get length(): Number {
        return this.list.length
    }

    get data():  Array<T> {
        return this.list
    }

    enqueue(element: T) {
        this.list.splice(this.list.length, 0, element);
    }

    dequeue() {
        return this.list.shift();
    }

    peek(): T {
        return this.list.at(0);
    }


}